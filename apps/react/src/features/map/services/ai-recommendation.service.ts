export interface AiRecommendationCategory {
  categoryId: number
  categoryName: string
  parentId: number | null
}

export interface AiRecommendationResult {
  region: string
  category: AiRecommendationCategory
}

export type AiRecommendationErrorCode = 'MISSING_TRANSCRIPT' | 'REQUEST_FAILED' | 'INVALID_RESPONSE' | 'MISSING_DATA'

export class AiRecommendationError extends Error {
  code: AiRecommendationErrorCode

  constructor(message: string, code: AiRecommendationErrorCode, options?: { cause?: unknown }) {
    super(message)
    this.name = 'AiRecommendationError'
    this.code = code
    if (options?.cause) {
      // Preserve original cause information for debugging when available
      ;(this as any).cause = options.cause
    }
  }
}

const OPENAI_CHAT_COMPLETION_URL = 'https://api.openai.com/v1/chat/completions'
const OPENAI_MODEL = 'gpt-4o-mini'

const CATEGORY_DEFINITIONS: AiRecommendationCategory[] = [
  { categoryId: 1, categoryName: '커피', parentId: null },
  { categoryId: 2, categoryName: '음식점', parentId: null },
  { categoryId: 3, categoryName: '문화', parentId: null },
  { categoryId: 4, categoryName: '여가', parentId: null },
  { categoryId: 5, categoryName: '상점', parentId: null },
  { categoryId: 6, categoryName: '양식', parentId: 2 },
  { categoryId: 7, categoryName: '중식', parentId: 2 },
  { categoryId: 8, categoryName: '일식', parentId: 2 },
  { categoryId: 9, categoryName: '한식', parentId: 2 },
  { categoryId: 10, categoryName: '동남아시아', parentId: 2 },
  { categoryId: 11, categoryName: '인도', parentId: 2 },
  { categoryId: 12, categoryName: '남미', parentId: 2 },
  { categoryId: 13, categoryName: '기타', parentId: 2 },
  { categoryId: 14, categoryName: '영화/연극/공연', parentId: 3 },
  { categoryId: 15, categoryName: '전시/기념관', parentId: 3 },
  { categoryId: 16, categoryName: '관광지(명승지)', parentId: 3 },
  { categoryId: 17, categoryName: '대형 레저', parentId: 4 },
  { categoryId: 18, categoryName: '엑티비티', parentId: 4 },
  { categoryId: 19, categoryName: '지역 레저', parentId: 4 },
  { categoryId: 20, categoryName: '지역 체육', parentId: 4 },
]

const categoriesById = new Map<number, AiRecommendationCategory>()
const categoriesByName = new Map<string, AiRecommendationCategory>()

CATEGORY_DEFINITIONS.forEach((category) => {
  categoriesById.set(category.categoryId, category)
  categoriesByName.set(normalizeCategoryName(category.categoryName), category)
})

const SYSTEM_PROMPT = [
  '당신은 사용자의 자연어 요청에서 방문하고자 하는 지역명과 매장 카테고리를 식별하는 전문가입니다.',
  '제공된 카테고리 목록에 포함된 항목만 선택할 수 있습니다.',
  '출력은 반드시 JSON 형식의 문자열 한 줄이어야 하며, 다음 스키마를 따라야 합니다.',
  '{"region": "지역명", "category": {"id": 카테고리ID, "name": "카테고리명"}}',
  '지역명은 사용자가 찾고자 하는 특정 행정 구역 또는 장소명을 짧게 요약하세요.',
  '정보가 부족하거나 모호하여 지역 또는 카테고리를 특정할 수 없다면 {"status":"RETRY","reason":"사유"} 형식으로 응답합니다.',
].join('\n')

const buildUserPrompt = (transcript: string) => {
  const categoryList = CATEGORY_DEFINITIONS.map(
    ({ categoryId, categoryName, parentId }) => `- id: ${categoryId}, name: ${categoryName}, parentId: ${parentId ?? 'null'}`
  ).join('\n')

  return [
    '아래는 사용자의 실제 음성 인식 결과입니다. 주요 요청을 분석해 주세요.',
    `사용자 발화:\n"""${transcript}"""`,
    '선택 가능한 카테고리 목록:',
    categoryList,
    '반드시 위 목록 중 하나의 id와 name을 선택해야 합니다. 결과는 JSON 문자열만 출력하세요.',
  ].join('\n\n')
}

interface AiChatCompletionPayload {
  messages: Array<{ role: 'system' | 'user'; content: string }>
}

interface AiGatewayChoice {
  message?: { content?: string | null } | null
}

interface AiGatewayError {
  message?: string
  type?: string
  code?: string
}

interface AiGatewayResponse {
  data?: unknown
  message?: string
  result?: unknown
  content?: unknown
  choices?: AiGatewayChoice[]
  error?: AiGatewayError | null
}

const removeCodeFences = (text: string) => {
  const trimmed = text.trim()
  if (trimmed.startsWith('```')) {
    return trimmed.replace(/^```[a-zA-Z]*\n?/, '').replace(/```$/, '').trim()
  }
  return trimmed
}

function normalizeCategoryName(name: string) {
  return name.replace(/\s+/g, '').trim().toLowerCase()
}

const resolveCategory = (value: unknown): AiRecommendationCategory | null => {
  if (typeof value === 'number') {
    return categoriesById.get(value) ?? null
  }

  if (typeof value === 'string') {
    return categoriesByName.get(normalizeCategoryName(value)) ?? null
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = resolveCategory(item)
      if (found) return found
    }
    return null
  }

  if (value && typeof value === 'object') {
    const candidate = value as Record<string, unknown>
    const idCandidate = candidate.id ?? candidate.categoryId
    const nameCandidate = candidate.name ?? candidate.categoryName

    if (typeof idCandidate === 'number') {
      const found = categoriesById.get(idCandidate)
      if (found) return found
    }

    if (typeof nameCandidate === 'string') {
      const found = categoriesByName.get(normalizeCategoryName(nameCandidate))
      if (found) return found
    }
  }

  return null
}

const unwrapAiContent = (payload: AiGatewayResponse): unknown => {
  if (!payload) return null

  if (payload.result) return payload.result
  if (payload.content) return payload.content

  if (payload.data && typeof payload.data === 'object') {
    const data = payload.data as Record<string, unknown>
    if (data.result) return data.result
    if (data.content) return data.content
    if (data.message && typeof data.message === 'object') {
      const message = data.message as Record<string, unknown>
      if (message.content) return message.content
    }
  }

  if (Array.isArray(payload.choices) && payload.choices.length > 0) {
    const choice = payload.choices.find((item) => item?.message?.content)
    if (choice?.message?.content) {
      return choice.message.content
    }
  }

  if ('message' in payload && payload.message && typeof payload.message === 'object') {
    const message = payload.message as Record<string, unknown>
    if (message.content) return message.content
  }

  return payload
}

const parseAiResult = (raw: unknown): AiRecommendationResult => {
  if (typeof raw === 'string') {
    const sanitized = removeCodeFences(raw)
    try {
      return parseAiResult(JSON.parse(sanitized))
    } catch (error) {
      throw new AiRecommendationError('AI 응답을 JSON 으로 해석할 수 없습니다.', 'INVALID_RESPONSE', { cause: error })
    }
  }

  if (!raw || typeof raw !== 'object') {
    throw new AiRecommendationError('AI 응답 포맷이 올바르지 않습니다.', 'INVALID_RESPONSE')
  }

  const payload = raw as Record<string, unknown>

  if (typeof payload.status === 'string' && payload.status.toUpperCase() === 'RETRY') {
    throw new AiRecommendationError('AI가 충분한 정보를 찾지 못했습니다.', 'MISSING_DATA')
  }

  const region = payload.region ?? payload.location ?? payload.area
  const categoryPayload = payload.category ?? payload.categoryInfo ?? payload.categoryId ?? payload.categoryName

  if (typeof region !== 'string' || region.trim() === '') {
    throw new AiRecommendationError('지역 정보를 찾을 수 없습니다.', 'MISSING_DATA')
  }

  const category = resolveCategory(categoryPayload)
  if (!category) {
    throw new AiRecommendationError('카테고리 정보를 찾을 수 없습니다.', 'MISSING_DATA')
  }

  return {
    region: region.trim(),
    category,
  }
}

export const requestAiRecommendation = async (
  transcript: string,
  options?: { signal?: AbortSignal }
): Promise<AiRecommendationResult> => {
  if (!transcript || transcript.trim() === '') {
    throw new AiRecommendationError('분석할 텍스트가 없습니다.', 'MISSING_TRANSCRIPT')
  }

  const payload: AiChatCompletionPayload = {
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: buildUserPrompt(transcript.trim()) },
    ],
  }

  try {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY
    if (!apiKey) {
      throw new AiRecommendationError('OpenAI API 키가 설정되지 않았습니다.', 'REQUEST_FAILED')
    }

    const response = await fetch(OPENAI_CHAT_COMPLETION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: payload.messages,
        temperature: 0.2,
        response_format: { type: 'json_object' },
      }),
      signal: options?.signal,
    })

    const rawText = await response.text()
    let data: AiGatewayResponse | null = null

    if (rawText) {
      try {
        data = JSON.parse(rawText) as AiGatewayResponse
      } catch {
        data = { content: rawText }
      }
    }

    if (!response.ok) {
      const message = data?.error?.message ?? `OpenAI 응답에 실패했습니다. (status: ${response.status})`
      throw new AiRecommendationError(message, 'REQUEST_FAILED')
    }

    const rawContent = unwrapAiContent((data ?? {}) as AiGatewayResponse)
    return parseAiResult(rawContent)
  } catch (error: any) {
    if (error instanceof AiRecommendationError) {
      throw error
    }

    if (error?.name === 'CanceledError' || error?.name === 'AbortError') {
      throw error
    }

    throw new AiRecommendationError('AI 추천 요청에 실패했습니다.', 'REQUEST_FAILED', { cause: error })
  }
}

export const formatRecommendationLabel = (result: AiRecommendationResult) => `${result.region} - ${result.category.categoryName}`

export const getAvailableCategories = () => [...CATEGORY_DEFINITIONS]
