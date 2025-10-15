import { useCallback, useEffect, useRef, useState, type FormEvent, type SetStateAction } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Mic, Send, X } from 'lucide-react'
import type { StoreListResponse } from '@data/user-api-axios/api'
import { StoreItem } from '@/features/store/list/ui/list.view'
import Button from '@/shared/ui/button'

interface AiRecommendationSheetProps {
  open: boolean
  onClose: () => void
}

interface RecommendationResult {
  id: string
  title: string
  store: StoreListResponse
}

const mockStores = [
  {
    storeId: 1,
    name: '맛있는 집',
    address: '서울특별시 강남구 테헤란로 1',
    lat: 37.4979,
    lon: 127.0276,
    isOpen: true,
    purchaseAmount: 10000,
    discountMin: 60,
    categories: [{ categoryId: 1, categoryName: '카페' }],
  },
  {
    storeId: 2,
    name: '가까운 집',
    address: '서울특별시 강남구 강남대로 2',
    lat: 37.4997,
    lon: 127.0265,
    isOpen: true,
    purchaseAmount: 10000,
    discountMin: 60,
    categories: [{ categoryId: 1, categoryName: '카페' }],
  },
  {
    storeId: 3,
    name: '저렴한 집',
    address: '서울특별시 강남구 봉은사로 3',
    lat: 37.5008,
    lon: 127.0251,
    isOpen: true,
    purchaseAmount: 10000,
    discountMin: 60,
    categories: [{ categoryId: 1, categoryName: '카페' }],
  },
] satisfies StoreListResponse[]

const MOCK_RESULTS_TEMPLATE: RecommendationResult[] = [
  { id: 'value', title: '최적 가성비 카페예요', store: mockStores[0]! },
  { id: 'distance', title: '가장 가까운 검색결과예요', store: mockStores[1]! },
  { id: 'price', title: '가장 저렴한 카페예요', store: mockStores[2]! },
]

const cloneStore = (store: StoreListResponse): StoreListResponse => ({
  ...store,
  categories: store.categories?.map((category) => ({ ...category })),
})

const createMockResults = (): RecommendationResult[] =>
  MOCK_RESULTS_TEMPLATE.map((item, idx) => ({
    id: `${item.id}-${idx}`,
    title: item.title,
    store: cloneStore(item.store),
  }))

export const AiRecommendationSheet = ({ open, onClose }: AiRecommendationSheetProps) => {
  const [transcript, setTranscript] = useState('')
  const [liveTranscript, setLiveTranscript] = useState('')
  const [manualInput, setManualInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [results, setResults] = useState<RecommendationResult[] | null>(null)
  const [resultQuery, setResultQuery] = useState('')

  const recognitionRef = useRef<any>(null)
  const silenceTimerRef = useRef<number | null>(null)
  const autoRequestRef = useRef(false)
  const restartOnEndRef = useRef(false)
  const transcriptRef = useRef(transcript)
  const liveTranscriptRef = useRef(liveTranscript)

  useEffect(() => {
    transcriptRef.current = transcript
  }, [transcript])

  useEffect(() => {
    liveTranscriptRef.current = liveTranscript
  }, [liveTranscript])

  const shortQueryGuide = '검색 결과가 없어요\n위치, 시간, 가게 종류를 알려주세요'

  const updateTranscript = useCallback((value: SetStateAction<string>) => {
    setTranscript((prev) => {
      const next = typeof value === 'function' ? (value as (val: string) => string)(prev) : value
      transcriptRef.current = next
      return next
    })
    setLiveTranscript('')
    liveTranscriptRef.current = ''
  }, [])

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current !== null) {
      window.clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }
  }, [])

  const handleSearch = useCallback(
    (query: string) => {
      const trimmedQuery = query.trim()
      if (!trimmedQuery) return

      updateTranscript(trimmedQuery)
      setStatusMessage(null)
      setError(null)
      setResultQuery(trimmedQuery)
      autoRequestRef.current = false
      restartOnEndRef.current = false
      setResults(createMockResults())
    },
    [updateTranscript]
  )

  const stopListening = useCallback(
    (options?: { restart?: boolean }) => {
      restartOnEndRef.current = options?.restart ?? false
      recognitionRef.current?.stop?.()
      setIsListening(false)
      clearSilenceTimer()
    },
    [clearSilenceTimer]
  )

  const handleSilenceTimeout = useCallback(() => {
    const finalText = transcriptRef.current.trim()
    const interimText = liveTranscriptRef.current.trim()
    const candidate = [finalText, interimText].filter(Boolean).join(' ').trim()

    if (candidate.length > 8) {
      setStatusMessage(null)
      setError(null)
      stopListening({ restart: false })
      handleSearch(candidate)
      return
    }

    setStatusMessage(shortQueryGuide)
    setError(null)
    stopListening({ restart: true })
  }, [handleSearch, shortQueryGuide, stopListening])

  const startSilenceTimer = useCallback(() => {
    clearSilenceTimer()
    silenceTimerRef.current = window.setTimeout(handleSilenceTimeout, 5000)
  }, [clearSilenceTimer, handleSilenceTimeout])

  const ensureRecognition = useCallback(() => {
    if (typeof window === 'undefined') return null
    const SpeechRecognitionCtor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognitionCtor) return null

    if (!recognitionRef.current) {
      const recognition = new SpeechRecognitionCtor()
      recognition.lang = 'ko-KR'
      recognition.continuous = true
      recognition.interimResults = true

      recognition.onstart = () => {
        setStatusMessage(null)
        setIsListening(true)
        startSilenceTimer()
      }

      recognition.onresult = (event: any) => {
        const interimPieces: string[] = []
        const finalPieces: string[] = []

        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const result = event.results[i] as any
          const text = result[0]?.transcript?.trim() ?? ''
          if (!text) continue

          if (result.isFinal) {
            finalPieces.push(text)
          } else {
            interimPieces.push(text)
          }
        }

        if (interimPieces.length > 0) {
          const interimText = interimPieces.join(' ')
          setLiveTranscript(interimText)
          liveTranscriptRef.current = interimText
          setError(null)
          setStatusMessage(null)
          startSilenceTimer()
        }

        if (finalPieces.length > 0) {
          const combined = finalPieces.join(' ')
          updateTranscript((prev) => (prev ? `${prev}\n${combined}` : combined))
          setError(null)
          setStatusMessage(null)
          startSilenceTimer()
        }
      }

      recognition.onerror = (event: any) => {
        if (event.error === 'not-allowed') {
          setError('마이크 접근 권한이 필요합니다.')
        } else if (event.error !== 'no-speech') {
          setError('음성 인식 중 오류가 발생했습니다.')
        }
        stopListening()
      }

      recognition.onend = () => {
        clearSilenceTimer()
        setIsListening(false)
      }

      recognitionRef.current = recognition
    }

    return recognitionRef.current
  }, [clearSilenceTimer, startSilenceTimer, stopListening, updateTranscript])

  const startListening = useCallback(() => {
    const recognition = ensureRecognition()
    if (!recognition) {
      setError('현재 브라우저에서는 음성 인식을 지원하지 않습니다.')
      return
    }

    setError(null)
    setStatusMessage(null)
    restartOnEndRef.current = false
    try {
      recognition.start()
    } catch {
      // 이미 시작된 상태에서 start를 호출하면 예외가 발생할 수 있으므로 무시
    }
  }, [ensureRecognition])

  const handleToggleListening = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }, [isListening, startListening, stopListening])

  const handleManualSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const value = manualInput.trim()
      if (!value) return
      updateTranscript((prev) => (prev ? `${prev}\n${value}` : value))
      setError(null)
      if (value.length <= 8) {
        setStatusMessage(shortQueryGuide)
        stopListening({ restart: false })
        return
      }
      setManualInput('')
      setStatusMessage(null)
      stopListening({ restart: false })
      handleSearch(value)
    },
    [handleSearch, manualInput, shortQueryGuide, stopListening, updateTranscript]
  )

  const handleManualInputChange = useCallback((value: string) => {
    setManualInput(value)
    setStatusMessage(null)
    setLiveTranscript('')
    liveTranscriptRef.current = ''
  }, [])

  const handleRetry = useCallback(() => {
    stopListening({ restart: false })
    setResults(null)
    setResultQuery('')
    updateTranscript('')
    setManualInput('')
    setStatusMessage(null)
    setError(null)
    setLiveTranscript('')
    liveTranscriptRef.current = ''
    autoRequestRef.current = false
    restartOnEndRef.current = false
    startListening()
  }, [startListening, stopListening, updateTranscript])

  const handleClose = useCallback(() => {
    stopListening({ restart: false })
    setResults(null)
    setResultQuery('')
    updateTranscript('')
    setManualInput('')
    setStatusMessage(null)
    setError(null)
    setLiveTranscript('')
    liveTranscriptRef.current = ''
    autoRequestRef.current = false
    restartOnEndRef.current = false
    onClose()
  }, [onClose, stopListening, updateTranscript])

  useEffect(() => {
    if (!open) {
      autoRequestRef.current = false
      stopListening()
      return
    }

    if (results) return

    if (!autoRequestRef.current) {
      autoRequestRef.current = true
      startListening()
    }
  }, [open, results, startListening, stopListening])

  useEffect(() => {
    if (results) return
    if (open && !isListening && restartOnEndRef.current) {
      restartOnEndRef.current = false
      startListening()
    }
  }, [isListening, open, results, startListening])

  useEffect(() => {
    return () => {
      stopListening()
      recognitionRef.current = null
    }
  }, [stopListening])

  const placeholderTranscript = '말씀해주세요...'
  const hasResults = Array.isArray(results) && results.length > 0

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="ai-dim"
            className="fixed inset-0 z-40 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
          />

          <motion.div
            key="ai-sheet"
            className="fixed bottom-0 left-1/2 z-50 flex w-full max-w-[768px] -translate-x-1/2 flex-col rounded-t-[32px] bg-white px-6 pb-[max(24px,env(safe-area-inset-bottom))]"
            style={{ height: '80vh' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 420, damping: 40 }}
            drag="y"
            dragDirectionLock
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) {
                handleClose()
              }
            }}
          >
            <div className="mx-auto mt-2 mb-4 h-1.5 w-12 rounded-full bg-gray-3" />

            <button
              type="button"
              className="absolute top-4 right-4 text-gray-2"
              onClick={handleClose}
              aria-label="닫기"
            >
              <X className="h-5 w-5" />
            </button>

            {hasResults ? (
              <RecommendationResultsView query={resultQuery} results={results!} onRetry={handleRetry} />
            ) : (
              <VoiceCaptureView
                transcript={transcript}
                liveTranscript={liveTranscript}
                placeholderTranscript={placeholderTranscript}
                statusMessage={statusMessage}
                error={error}
                isListening={isListening}
                manualInput={manualInput}
                onToggleListening={handleToggleListening}
                onManualInputChange={handleManualInputChange}
                onManualSubmit={handleManualSubmit}
              />
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

interface VoiceCaptureViewProps {
  transcript: string
  liveTranscript: string
  placeholderTranscript: string
  statusMessage: string | null
  error: string | null
  isListening: boolean
  manualInput: string
  onToggleListening: () => void
  onManualInputChange: (value: string) => void
  onManualSubmit: (event: FormEvent<HTMLFormElement>) => void
}

const VoiceCaptureView = ({
  transcript,
  liveTranscript,
  placeholderTranscript,
  statusMessage,
  error,
  isListening,
  manualInput,
  onToggleListening,
  onManualInputChange,
  onManualSubmit,
}: VoiceCaptureViewProps) => {
  const combined = [transcript, liveTranscript].filter(Boolean)
  const displayText =
    combined.length > 0 ? combined.join(transcript && liveTranscript ? '\n' : '') : !error ? placeholderTranscript : ''

  return (
    <div className="flex h-full flex-col items-center gap-6 py-6">
      <div className="text-center">
        <h2 className="text-body-3 text-gray-1">목적지를 말씀해주세요</h2>
        <p className="mt-1 text-caption-1 text-gray-3">
          {isListening ? 'AI가 음성을 듣고 있어요.' : '마이크 아이콘을 눌러 다시 말씀하실 수 있어요.'}
        </p>
      </div>

      <button
        type="button"
        onClick={onToggleListening}
        className="relative flex h-[160px] w-[160px] items-center justify-center focus:outline-none"
      >
        <span
          className={`absolute inset-0 rounded-full transition ${isListening ? 'animate-ping bg-primary-2/60' : 'bg-primary-2/20'}`}
        />
        <span className="relative flex h-[140px] w-[140px] items-center justify-center rounded-full bg-primary-2">
          <span className="flex h-[104px] w-[104px] items-center justify-center rounded-full bg-white shadow-lg">
            <Mic className={`h-16 w-16 ${isListening ? 'text-primary-1' : 'text-gray-3'}`} />
          </span>
        </span>
      </button>

      <div className="w-full flex-1 overflow-hidden">
        <div className="bg-gray-5 flex h-full flex-col items-center justify-center gap-2 rounded-2xl px-6 py-6 text-center">
          <p className="text-body-3 whitespace-pre-line text-gray-1">{displayText}</p>
          {statusMessage && <p className="text-caption-1 whitespace-pre-line text-gray-3">{statusMessage}</p>}
          {error && <p className="text-caption-2 text-red-500">{error}</p>}
        </div>
      </div>

      <form
        onSubmit={onManualSubmit}
        className="bg-gray-5 mt-auto flex w-full items-center gap-3 rounded-full border border-gray-4 px-5 py-3"
      >
        <input
          type="text"
          value={manualInput}
          onChange={(event) => onManualInputChange(event.target.value)}
          placeholder="어떤 장소를 찾으시나요?"
          className="flex-1 bg-transparent text-body-4 text-gray-1 placeholder:text-gray-3 focus:outline-none"
        />
        <button
          type="submit"
          className="text-primary-1 transition disabled:text-gray-3"
          disabled={!manualInput.trim()}
          aria-label="텍스트로 전달"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  )
}

interface RecommendationResultsViewProps {
  query: string
  results: RecommendationResult[]
  onRetry: () => void
}

const RecommendationResultsView = ({ query, results, onRetry }: RecommendationResultsViewProps) => {
  return (
    <div className="flex h-full flex-col gap-6 py-6">
      <div className="text-center">
        <p className="text-body-3 font-semibold text-gray-1">[{query}] 추천 결과</p>
        <p className="mt-1 text-caption-1 text-gray-3">AI가 선별한 맞춤 매장을 확인해 보세요.</p>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto pr-1">
        {results.map((item) => (
          <div key={item.id} className="bg-gray-5 rounded-3xl px-5 py-4">
            <p className="mb-3 text-body-4 text-gray-1">{item.title}</p>
            <StoreItem store={item.store} />
          </div>
        ))}
      </div>

      <Button className="mt-auto w-full" onClick={onRetry}>
        다시 검색하기
      </Button>
    </div>
  )
}
