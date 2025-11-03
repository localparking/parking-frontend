export interface AiRecommendationCategory {
  categoryId: number
  categoryName: string
  parentId: number | null
}

export interface AiRecommendationResult {
  region: string
  category: AiRecommendationCategory
  query: string
  coordinates?: {
    lat: number
    lon: number
  }
}

export type AiModelErrorCode = 'LOCATION_OUT' | 'NO_CATEGORY' | 'NO_RESPONSE' | 'NO_RESULT' | 'ERROR'

export type AiRecommendationErrorCode = 'MISSING_TRANSCRIPT' | 'REQUEST_FAILED' | 'INVALID_RESPONSE' | 'MODEL_RETRY'

export class AiRecommendationError extends Error {
  code: AiRecommendationErrorCode
  reason?: string
  modelCode?: AiModelErrorCode

  constructor(
    message: string,
    code: AiRecommendationErrorCode,
    options?: { cause?: unknown; reason?: string; modelCode?: AiModelErrorCode }
  ) {
    super(message)
    this.name = 'AiRecommendationError'
    this.code = code
    this.reason = options?.reason
    this.modelCode = options?.modelCode
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
  '당신은 사용자의 음성(STT)으로부터 방문하려는 장소 정보를 정제하는 전문가입니다.',
  '이 서비스는 "대한민국 서울특별시" 내 지역만 지원합니다. 조건을 만족하지 못하면 지정된 오류 코드를 사용해야 합니다.',
  '출력은 반드시 JSON 한 줄이어야 하며 아래 스키마 중 하나를 따라야 합니다.',
  '성공: {"status":"SUCCESS","region":"지역명","category":{"id":카테고리ID,"name":"카테고리명"},"query":"검색용 문장","coordinates":{"lat":위도,"lon":경도}}',
  '실패: {"status":"ERROR","code":"LOCATION_OUT|NO_CATEGORY|NO_RESPONSE|ERROR","message":"사용자 안내 문구"}',
  '오류 코드 정의:\n- LOCATION_OUT: 서울특별시 외 지역 요청\n- NO_CATEGORY: 지역 또는 카테고리를 특정할 수 없음\n- NO_RESPONSE: 충분한 발화가 없음\n- ERROR: 그 외 오류',
  '성공 시 query는 지역명과 업종이 자연스럽게 포함된 문장이어야 하며, coordinates는 해당 지역(서울 내)의 대표 좌표를 제공합니다.',
].join('\n')

const buildUserPrompt = (transcript: string) => {
  const categoryList = CATEGORY_DEFINITIONS.map(
    ({ categoryId, categoryName, parentId }) =>
      `- id: ${categoryId}, name: ${categoryName}, parentId: ${parentId ?? 'null'}`
  ).join('\n')

  return [
    '아래는 사용자의 실제 음성 인식 결과입니다. 서울특별시 내에서의 지역과 카테고리를 분석하고 좌표를 제공하거나, 조건을 만족하지 못하면 위 오류 코드를 사용하세요.',
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

const extractChoiceContent = (payload: AiGatewayResponse | null | undefined): string | null => {
  if (!payload || !Array.isArray(payload.choices)) return null

  for (const choice of payload.choices) {
    const content = choice?.message?.content
    if (typeof content === 'string' && content.trim()) {
      return content
    }
  }

  return null
}

const removeCodeFences = (text: string) => {
  const trimmed = text.trim()
  if (trimmed.startsWith('```')) {
    return trimmed
      .replace(/^```[a-zA-Z]*\n?/, '')
      .replace(/```$/, '')
      .trim()
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
  if (!raw || typeof raw !== 'object') {
    throw new AiRecommendationError('AI 응답 포맷이 올바르지 않습니다.', 'INVALID_RESPONSE')
  }

  const payload = raw as Record<string, unknown>

  const statusRaw = typeof payload.status === 'string' ? payload.status.trim() : undefined
  const status = statusRaw?.toUpperCase()

  if (status === 'ERROR') {
    const codeRaw = typeof payload.code === 'string' ? payload.code.trim().toUpperCase() : undefined
    const modelCode = (['LOCATION_OUT', 'NO_CATEGORY', 'NO_RESPONSE', 'NO_RESULT', 'ERROR'] as AiModelErrorCode[]).find(
      (value) => value === codeRaw
    )
    const message =
      typeof payload.message === 'string' && payload.message.trim() ? payload.message.trim() : 'AI 요청이 실패했습니다.'

    throw new AiRecommendationError(message, 'MODEL_RETRY', {
      reason: message,
      modelCode,
    })
  }

  const statusAsErrorCode = (
    ['LOCATION_OUT', 'NO_CATEGORY', 'NO_RESPONSE', 'NO_RESULT', 'ERROR'] as AiModelErrorCode[]
  ).find((value) => value === status)

  if (statusAsErrorCode) {
    const message =
      typeof payload.message === 'string' && payload.message.trim() ? payload.message.trim() : 'AI 요청이 실패했습니다.'
    throw new AiRecommendationError(message, 'MODEL_RETRY', {
      reason: message,
      modelCode: statusAsErrorCode,
    })
  }

  if (status && status !== 'SUCCESS' && status !== 'OK') {
    throw new AiRecommendationError('AI 응답 상태를 이해할 수 없습니다.', 'INVALID_RESPONSE')
  }

  const region = payload.region
  const categoryPayload = payload.category
  const queryValue = payload.query
  const coordinatesPayload =
    payload.coordinates ??
    payload.locationCoordinates ??
    payload.coords ??
    (typeof payload.lat === 'number' || typeof payload.lon === 'number' ? { lat: payload.lat, lon: payload.lon } : null)

  if (typeof region !== 'string' || region.trim() === '') {
    throw new AiRecommendationError('지역 정보를 찾을 수 없습니다.', 'INVALID_RESPONSE')
  }

  const category = resolveCategory(categoryPayload)
  if (!category) {
    throw new AiRecommendationError('카테고리 정보를 찾을 수 없습니다.', 'INVALID_RESPONSE')
  }

  if (typeof queryValue !== 'string' || queryValue.trim() === '') {
    throw new AiRecommendationError('검색어를 구성할 수 없습니다.', 'INVALID_RESPONSE')
  }

  let coordinates: AiRecommendationResult['coordinates']
  if (coordinatesPayload && typeof coordinatesPayload === 'object') {
    const raw = coordinatesPayload as Record<string, unknown>
    const latValue = raw.lat ?? raw.latitude
    const lonValue = raw.lon ?? raw.lng ?? raw.longitude

    const lat = typeof latValue === 'string' ? Number(latValue) : (latValue as number | undefined)
    const lon = typeof lonValue === 'string' ? Number(lonValue) : (lonValue as number | undefined)

    if (typeof lat === 'number' && !Number.isNaN(lat) && typeof lon === 'number' && !Number.isNaN(lon)) {
      coordinates = { lat, lon }
    }
  }

  return {
    region: region.trim(),
    category,
    query: queryValue.trim(),
    coordinates,
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

    const choiceContent = extractChoiceContent(data)
    const rawContent = choiceContent ?? unwrapAiContent((data ?? {}) as AiGatewayResponse)
    if (rawContent == null) {
      throw new AiRecommendationError('AI 응답에서 결과를 찾지 못했습니다.', 'INVALID_RESPONSE')
    }
    let parsedContent: unknown = rawContent
    if (typeof rawContent === 'string') {
      const sanitized = removeCodeFences(rawContent)
      try {
        parsedContent = JSON.parse(sanitized)
      } catch (error) {
        throw new AiRecommendationError('AI 응답을 JSON 으로 해석할 수 없습니다.', 'INVALID_RESPONSE', { cause: error })
      }
    }
    return parseAiResult(parsedContent)
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

export const formatRecommendationLabel = (result: AiRecommendationResult) =>
  result.query || `${result.region} - ${result.category.categoryName}`

export const getAvailableCategories = () => [...CATEGORY_DEFINITIONS]
