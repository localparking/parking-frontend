import { useCallback, useEffect, useRef, useState, type FormEvent, type SetStateAction } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MapPin, Mic, Send, X } from 'lucide-react'
import type { StoreListResponse, StoreSearchRequest } from '@data/user-api-axios/api'
import {
  requestAiRecommendation,
  AiRecommendationError,
  type AiModelErrorCode,
} from '../services/ai-recommendation.service'
import Button from '@/shared/ui/button'
import { bridge } from '@/shared/bridge'
import { isWebView } from '@/shared/utils/webview'
import { useNavigation, useMapContext, MapDisplayType } from '@/features/map'
import StatusBadge from '@/shared/ui/status-badge'
import { StoreCategoryIcon } from '@/shared/ui/custom-icons'
import storeService from '@/shared/services/store.service'

interface AiRecommendationSheetProps {
  open: boolean
  onClose: () => void
}

interface RecommendationResult {
  id: string
  title: string
  store: StoreListResponse
}

const ERROR_MESSAGE_BY_CODE: Record<AiModelErrorCode, string> = {
  LOCATION_OUT: '서울 지역만 검색을 지원하고 있어요.',
  NO_CATEGORY: '보다 정확한 지역과 원하는 가게 카테고리를 알려주세요.',
  NO_RESPONSE: '잘못된 응답 요청입니다. 다시 시도해 주세요.',
  NO_RESULT: '추천 결과가 없어요. 다른 조건으로 다시 말씀해 주세요.',
  ERROR: '서버 오류입니다.',
}

const GENERIC_SERVER_ERROR = '서버 오류입니다.'

interface NavigationUrls {
  app: string
  web: string
}

const APP_NAME_FOR_NAVIGATION = 'parking-frontend'

const isMobileEnvironment = () => {
  if (typeof window === 'undefined') return false
  const userAgent = window.navigator?.userAgent ?? ''
  return /iphone|ipad|ipod|android/i.test(userAgent)
}

const buildRecommendationResults = (stores: StoreListResponse[]): RecommendationResult[] =>
  stores.map((store, idx) => ({
    id: `store-${store.storeId}-${idx}`,
    title: idx === 0 ? 'AI가 선별한 매장이에요' : '다른 추천 매장이에요',
    store,
  }))

const isIOSBrowser = () => {
  if (typeof window === 'undefined') return false
  const userAgent = window.navigator?.userAgent ?? ''
  return /iphone|ipad|ipod/i.test(userAgent)
}

const openExternalUrl = (url: string) => {
  const openUsingWindow = () => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (!newWindow) {
      window.location.href = url
    }
  }

  if (isWebView()) {
    const bridgeWithPotentialHandlers = bridge as unknown as {
      openExternalBrowser?: (targetUrl: string) => unknown
      openExternalUrl?: (targetUrl: string) => unknown
      openExternal?: (targetUrl: string) => unknown
    }

    const handler =
      bridgeWithPotentialHandlers.openExternalBrowser ??
      bridgeWithPotentialHandlers.openExternalUrl ??
      bridgeWithPotentialHandlers.openExternal

    if (typeof handler === 'function') {
      Promise.resolve(handler.call(bridge, url)).catch(openUsingWindow)
      return
    }
  }

  openUsingWindow()
}

const openNavigationWithFallback = ({ app, web }: NavigationUrls) => {
  if (typeof window === 'undefined') return

  if (!isMobileEnvironment()) {
    openExternalUrl(web)
    return
  }

  if (typeof document === 'undefined') {
    openExternalUrl(web)
    return
  }

  const scheduleFallback = (timeout = 1500) => {
    const fallbackTimeout = window.setTimeout(() => {
      openExternalUrl(web)
    }, timeout)

    const cancelFallback = () => {
      window.clearTimeout(fallbackTimeout)
      window.removeEventListener('pagehide', cancelFallback)
      window.removeEventListener('blur', cancelFallback)
    }

    window.addEventListener('pagehide', cancelFallback, { once: true })
    window.addEventListener('blur', cancelFallback, { once: true })
  }

  if (isIOSBrowser()) {
    scheduleFallback()
    window.location.href = app
    return
  }

  let iframe: HTMLIFrameElement | null = document.createElement('iframe')
  iframe.style.display = 'none'
  iframe.src = app

  const cleanup = () => {
    if (iframe && iframe.parentNode) {
      iframe.parentNode.removeChild(iframe)
    }
    iframe = null
  }

  scheduleFallback(1200)

  try {
    document.body.appendChild(iframe)
  } catch {
    cleanup()
    openExternalUrl(web)
    return
  }

  window.addEventListener('pagehide', cleanup, { once: true })
  window.addEventListener('blur', cleanup, { once: true })
}

const toNaverNavigationUrls = (store: StoreListResponse): NavigationUrls => {
  const encodedName = encodeURIComponent(store.name)
  const encodedAppName = encodeURIComponent(APP_NAME_FOR_NAVIGATION)
  const fallbackTarget = store.address || store.name
  const fallbackQuery = encodeURIComponent(fallbackTarget)

  return {
    app: `nmap://route/car?dlat=${store.lat}&dlng=${store.lon}&dname=${encodedName}&appname=${encodedAppName}`,
    web: `https://map.naver.com/v5/search/${fallbackQuery}`,
  }
}

const toKakaoNavigationUrls = (store: StoreListResponse): NavigationUrls => {
  const encodedName = encodeURIComponent(store.name)

  return {
    app: `kakaomap://route?ep=${store.lat},${store.lon}&by=CAR`,
    web: `https://map.kakao.com/link/to/${encodedName},${store.lat},${store.lon}`,
  }
}

export const AiRecommendationSheet = ({ open, onClose }: AiRecommendationSheetProps) => {
  const { naverMap, setSearchKeyword, storeSearchParams, setStoreSearchParams, setMapDisplayType } = useMapContext()
  const [transcript, setTranscript] = useState('')
  const [liveTranscript, setLiveTranscript] = useState('')
  const [manualInput, setManualInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [results, setResults] = useState<RecommendationResult[] | null>(null)
  const [resultQuery, setResultQuery] = useState('')
  const [isProcessingQuery, setIsProcessingQuery] = useState(false)

  const openRef = useRef(open)
  const recognitionRef = useRef<any>(null)
  const silenceTimerRef = useRef<number | null>(null)
  const autoRequestRef = useRef(false)
  const restartOnEndRef = useRef(false)
  const transcriptRef = useRef(transcript)
  const liveTranscriptRef = useRef(liveTranscript)
  const aiRequestControllerRef = useRef<AbortController | null>(null)
  const startListeningRef = useRef<() => void>(() => {})

  const SILENCE_AFTER_SPEECH_MS = 3000
  const SILENCE_WITHOUT_SPEECH_MS = 10000

  useEffect(() => {
    transcriptRef.current = transcript
  }, [transcript])

  useEffect(() => {
    liveTranscriptRef.current = liveTranscript
  }, [liveTranscript])

  useEffect(() => {
    openRef.current = open
  }, [open])

  const updateTranscript = useCallback((value: SetStateAction<string>) => {
    setTranscript((prev) => {
      const next = typeof value === 'function' ? (value as (val: string) => string)(prev) : value
      transcriptRef.current = next
      return next
    })
    setLiveTranscript('')
    liveTranscriptRef.current = ''
  }, [])

  const resetInputFields = useCallback(() => {
    updateTranscript('')
    setManualInput('')
  }, [updateTranscript])

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current !== null) {
      window.clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }
  }, [])

  const stopListening = useCallback(
    (options?: { restart?: boolean }) => {
      restartOnEndRef.current = options?.restart ?? false
      recognitionRef.current?.stop?.()
      setIsListening(false)
      clearSilenceTimer()
    },
    [clearSilenceTimer]
  )

  const handleSearch = useCallback(
    async (query: string) => {
      const trimmedQuery = query.trim()
      if (!trimmedQuery) return
      if (isProcessingQuery) return

      stopListening({ restart: false })
      resetInputFields()
      updateTranscript(trimmedQuery)
      setError(null)
      setResults(null)
      setResultQuery('')
      setStatusMessage('AI가 요청을 분석 중이에요...')
      setIsProcessingQuery(true)
      autoRequestRef.current = true
      restartOnEndRef.current = false

      aiRequestControllerRef.current?.abort()
      const controller = new AbortController()
      aiRequestControllerRef.current = controller

      try {
        const aiResult = await requestAiRecommendation(trimmedQuery, { signal: controller.signal })
        const categoryIds = [aiResult.category.categoryId]
        const distanceLevel = naverMap.distanceLevel ?? 1
        const { center } = naverMap.currentMapInfo
        const targetLat = aiResult.coordinates?.lat ?? center.lat
        const targetLon = aiResult.coordinates?.lon ?? center.lng

        if (aiResult.coordinates) {
          naverMap.moveTo({ lat: targetLat, lng: targetLon })
        }

        const nextStoreParams = {
          ...storeSearchParams,
          categoryIds,
          page: 0,
        }

        setStoreSearchParams(nextStoreParams)
        setSearchKeyword(aiResult.query)
        setMapDisplayType(MapDisplayType.STORE)

        setStatusMessage('추천 매장을 찾고 있어요...')

        const storeRequest: StoreSearchRequest = {
          distanceLevel,
          lat: targetLat,
          lon: targetLon,
          query: aiResult.query,
          categoryIds,
          sort: nextStoreParams.sort,
          page: 0,
          ...(typeof nextStoreParams.maxFreeMin === 'number' ? { maxFreeMin: nextStoreParams.maxFreeMin } : {}),
          ...(typeof nextStoreParams.isOpen === 'boolean' ? { isOpen: nextStoreParams.isOpen } : {}),
          ...(typeof nextStoreParams.is24Hours === 'boolean' ? { is24Hours: nextStoreParams.is24Hours } : {}),
          ...(nextStoreParams.checkDayOfWeek ? { checkDayOfWeek: nextStoreParams.checkDayOfWeek } : {}),
          ...(nextStoreParams.checkTime ? { checkTime: nextStoreParams.checkTime } : {}),
        }

        const { data: storeResponse } = await storeService.postStoreKeywordSearch(storeRequest)
        const stores = storeResponse.data?.content ?? []

        if (!stores.length) {
          setError(ERROR_MESSAGE_BY_CODE.NO_RESULT)
          setStatusMessage(null)
          setResultQuery(aiResult.query)
          resetInputFields()
          return
        }

        const topStores = stores.slice(0, 3)
        setResultQuery(aiResult.query)
        setStatusMessage(null)
        setError(null)
        setResults(buildRecommendationResults(topStores))
      } catch (error) {
        if (controller.signal.aborted) return

        stopListening({ restart: false })
        resetInputFields()

        let errorMessage: string = GENERIC_SERVER_ERROR

        if (error instanceof AiRecommendationError) {
          if (error.modelCode && ERROR_MESSAGE_BY_CODE[error.modelCode]) {
            errorMessage = ERROR_MESSAGE_BY_CODE[error.modelCode]
          } else if (error.code === 'MISSING_TRANSCRIPT') {
            errorMessage = ERROR_MESSAGE_BY_CODE.NO_RESPONSE
          } else if (error.reason) {
            errorMessage = error.reason
          } else if (error.message) {
            errorMessage = error.message
          }
        }

        setResults(null)
        setResultQuery('')
        setError(errorMessage)
        setStatusMessage(null)
      } finally {
        if (aiRequestControllerRef.current === controller) {
          aiRequestControllerRef.current = null
        }
        setIsProcessingQuery(false)
      }
    },
    [
      isProcessingQuery,
      naverMap.currentMapInfo.center.lat,
      naverMap.currentMapInfo.center.lng,
      naverMap.distanceLevel,
      naverMap.moveTo,
      resetInputFields,
      setMapDisplayType,
      setSearchKeyword,
      setStoreSearchParams,
      stopListening,
      storeSearchParams,
      updateTranscript,
    ]
  )

  const handleSilenceTimeout = useCallback(() => {
    if (isProcessingQuery) return

    const finalText = transcriptRef.current.trim()
    const interimText = liveTranscriptRef.current.trim()
    const candidate = [finalText, interimText].filter(Boolean).join(' ').trim()

    if (candidate.length > 0) {
      setStatusMessage(null)
      setError(null)
      stopListening({ restart: false })
      void handleSearch(candidate)
      return
    }

    setStatusMessage(null)
    setError(ERROR_MESSAGE_BY_CODE.NO_RESPONSE)
    stopListening({ restart: false })
    resetInputFields()
  }, [handleSearch, isProcessingQuery, resetInputFields, stopListening])

  const startSilenceTimer = useCallback(
    (timeoutMs: number) => {
      clearSilenceTimer()
      silenceTimerRef.current = window.setTimeout(handleSilenceTimeout, timeoutMs)
    },
    [clearSilenceTimer, handleSilenceTimeout]
  )

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
        startSilenceTimer(SILENCE_WITHOUT_SPEECH_MS)
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
          startSilenceTimer(SILENCE_AFTER_SPEECH_MS)
        }

        if (finalPieces.length > 0) {
          const combined = finalPieces.join(' ')
          updateTranscript((prev) => (prev ? `${prev}\n${combined}` : combined))
          setError(null)
          setStatusMessage(null)
          startSilenceTimer(SILENCE_AFTER_SPEECH_MS)
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

  useEffect(() => {
    startListeningRef.current = startListening
  }, [startListening])

  const handleToggleListening = useCallback(() => {
    if (isProcessingQuery) return

    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }, [isListening, isProcessingQuery, startListening, stopListening])

  const handleManualSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (isProcessingQuery) return

      const value = manualInput.trim()
      if (!value) return
      resetInputFields()
      updateTranscript(value)
      setError(null)
      setStatusMessage(null)
      stopListening({ restart: false })
      void handleSearch(value)
    },
    [handleSearch, isProcessingQuery, manualInput, resetInputFields, stopListening, updateTranscript]
  )

  const handleManualInputChange = useCallback((value: string) => {
    setManualInput(value)
    setStatusMessage(null)
    setLiveTranscript('')
    liveTranscriptRef.current = ''
  }, [])

  const handleRetry = useCallback(() => {
    aiRequestControllerRef.current?.abort()
    aiRequestControllerRef.current = null
    setIsProcessingQuery(false)
    stopListening({ restart: false })
    setResults(null)
    setResultQuery('')
    resetInputFields()
    setStatusMessage(null)
    setError(null)
    autoRequestRef.current = true
    restartOnEndRef.current = false
    startListening()
  }, [resetInputFields, startListening, stopListening])

  const handleClose = useCallback(() => {
    aiRequestControllerRef.current?.abort()
    aiRequestControllerRef.current = null
    setIsProcessingQuery(false)
    stopListening({ restart: false })
    setResults(null)
    setResultQuery('')
    resetInputFields()
    setStatusMessage(null)
    setError(null)
    autoRequestRef.current = false
    restartOnEndRef.current = false
    onClose()
  }, [onClose, resetInputFields, stopListening])

  useEffect(() => {
    if (!open) {
      autoRequestRef.current = false
      stopListening()
      return
    }

    if (results) return

    if (!autoRequestRef.current && !isProcessingQuery) {
      autoRequestRef.current = true
      startListening()
    }
  }, [isProcessingQuery, open, results, startListening, stopListening])

  useEffect(() => {
    if (results) return
    if (open && !isListening && restartOnEndRef.current) {
      restartOnEndRef.current = false
      startListening()
    }
  }, [isListening, open, results, startListening])

  useEffect(() => {
    return () => {
      aiRequestControllerRef.current?.abort()
      aiRequestControllerRef.current = null
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
              <RecommendationResultsView
                query={resultQuery}
                results={results!}
                onRetry={handleRetry}
                onSelectStore={handleClose}
              />
            ) : (
              <VoiceCaptureView
                transcript={transcript}
                liveTranscript={liveTranscript}
                placeholderTranscript={placeholderTranscript}
                statusMessage={statusMessage}
                error={error}
                isListening={isListening}
                isProcessing={isProcessingQuery}
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
  isProcessing: boolean
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
  isProcessing,
  manualInput,
  onToggleListening,
  onManualInputChange,
  onManualSubmit,
}: VoiceCaptureViewProps) => {
  const combined = [transcript, liveTranscript].filter(Boolean)
  const displayText =
    combined.length > 0 ? combined.join(transcript && liveTranscript ? '\n' : '') : !error ? placeholderTranscript : ''
  const hasError = Boolean(error)
  const transcriptContainerClass = `bg-gray-5 flex h-full flex-col items-center justify-center gap-2 rounded-2xl px-6 py-6 text-center ${
    hasError ? 'border border-red-400 bg-red-50 text-red-600' : ''
  }`

  return (
    <div className="flex h-full flex-col items-center gap-6 py-6">
      <div className="text-center">
        <h2 className="text-body-3 text-gray-1">목적지를 말씀해주세요</h2>
        <p className="mt-1 text-caption-1 text-gray-3">
          {isProcessing
            ? 'AI가 방금 전 요청을 분석하고 있어요.'
            : isListening
              ? 'AI가 음성을 듣고 있어요.'
              : '마이크 아이콘을 눌러 다시 말씀하실 수 있어요.'}
        </p>
      </div>

      <button
        type="button"
        onClick={onToggleListening}
        disabled={isProcessing}
        aria-busy={isProcessing}
        className={`relative flex h-[160px] w-[160px] items-center justify-center focus:outline-none ${isProcessing ? 'cursor-not-allowed opacity-60' : ''}`}
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
        <div className={transcriptContainerClass}>
          <p className={`text-body-3 whitespace-pre-line ${hasError ? 'text-red-600' : 'text-gray-1'}`}>
            {displayText}
          </p>
          {statusMessage && <p className="text-caption-1 whitespace-pre-line text-gray-3">{statusMessage}</p>}
          {error && <p className="text-caption-2 font-medium text-red-600">{error}</p>}
        </div>
      </div>

      <form
        onSubmit={onManualSubmit}
        aria-busy={isProcessing}
        className="bg-gray-5 mt-auto flex w-full items-center gap-3 rounded-full border border-gray-4 px-5 py-3"
      >
        <input
          type="text"
          value={manualInput}
          onChange={(event) => onManualInputChange(event.target.value)}
          placeholder="어떤 장소를 찾으시나요?"
          disabled={isProcessing}
          className="flex-1 bg-transparent text-body-4 text-gray-1 placeholder:text-gray-3 focus:outline-none disabled:text-gray-3"
        />
        <button
          type="submit"
          className="text-primary-1 transition disabled:cursor-not-allowed disabled:text-gray-3"
          disabled={isProcessing || !manualInput.trim()}
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
  onSelectStore: () => void
}

const RecommendationResultsView = ({ query, results, onRetry, onSelectStore }: RecommendationResultsViewProps) => {
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
            <RecommendationStoreItem store={item.store} onSelect={onSelectStore} />
          </div>
        ))}
      </div>

      <Button className="mt-auto w-full" onClick={onRetry}>
        다시 검색하기
      </Button>
    </div>
  )
}

interface RecommendationStoreItemProps {
  store: StoreListResponse
  onSelect: () => void
}

const RecommendationStoreItem = ({ store, onSelect }: RecommendationStoreItemProps) => {
  const { navigateToStoreDetail } = useNavigation()
  const { moveTo } = useMapContext().naverMap
  const [showNavigationOptions, setShowNavigationOptions] = useState(false)
  const navigationMenuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!showNavigationOptions) return

    const handleOutsideInteraction = (event: MouseEvent | TouchEvent) => {
      if (!navigationMenuRef.current) return
      const target = event.target as Node | null
      if (!target || navigationMenuRef.current.contains(target)) return
      setShowNavigationOptions(false)
    }

    document.addEventListener('mousedown', handleOutsideInteraction)
    document.addEventListener('touchstart', handleOutsideInteraction)

    return () => {
      document.removeEventListener('mousedown', handleOutsideInteraction)
      document.removeEventListener('touchstart', handleOutsideInteraction)
    }
  }, [showNavigationOptions])

  const handleSelectStore = useCallback(() => {
    setShowNavigationOptions(false)
    onSelect()
    moveTo({ lat: store.lat, lng: store.lon })
    navigateToStoreDetail(store.storeId.toString())
  }, [moveTo, navigateToStoreDetail, onSelect, store.lat, store.lon, store.storeId])

  const handleGuideStart = useCallback(() => {
    setShowNavigationOptions((prev) => {
      if (!prev) {
        moveTo({ lat: store.lat, lng: store.lon })
      }
      return !prev
    })
  }, [moveTo, store.lat, store.lon])

  const handleNavigationLaunch = (provider: 'naver' | 'kakao') => {
    const urls = provider === 'naver' ? toNaverNavigationUrls(store) : toKakaoNavigationUrls(store)
    setShowNavigationOptions(false)
    openNavigationWithFallback(urls)
  }

  const primaryCategory = store.categories?.[0]
  const promotionText =
    store.discountMin && store.purchaseAmount
      ? `${store.purchaseAmount.toLocaleString()}원 이상 구매시 ${store.discountMin}분 무료 주차`
      : store.address

  return (
    <div className="flex items-center gap-4 rounded-2xl bg-white px-4 py-3 shadow-sm">
      <button type="button" onClick={handleSelectStore} className="flex flex-1 items-center gap-3 text-left">
        <div className="flex h-15 w-15 items-center justify-center rounded-full bg-primary-2/20">
          <StoreCategoryIcon category={primaryCategory} className="h-[60px] w-[60px]" />
        </div>
        <div className="flex flex-1 flex-col gap-1">
          {primaryCategory?.categoryName && (
            <p className="text-caption-3 text-gray-3">{primaryCategory.categoryName}</p>
          )}
          <div className="flex items-center gap-2 pr-2">
            <h3 className="text-body-4 text-gray-1">{store.name}</h3>
            <StatusBadge isOpen={Boolean(store.isOpen)} />
          </div>
          <p className="text-caption-2 text-gray-2">{promotionText}</p>
        </div>
      </button>

      <div ref={navigationMenuRef} className="relative flex flex-col items-center gap-1 text-primary-1">
        <button
          type="button"
          onClick={handleGuideStart}
          className="flex flex-col items-center gap-1 text-primary-1"
          aria-label="안내 시작"
        >
          <span className="grid h-14 w-14 place-items-center rounded-full bg-primary-2">
            <MapPin className="h-6 w-6" />
          </span>
          <span className="text-caption-2 font-medium">안내시작</span>
        </button>

        {showNavigationOptions && (
          <div className="border-gray-5 absolute top-full right-0 z-50 mt-2 w-44 rounded-2xl border bg-white p-3 shadow-lg">
            <p className="mb-2 text-caption-3 text-gray-3">길안내 앱을 선택하세요</p>
            <button
              type="button"
              onClick={() => handleNavigationLaunch('naver')}
              className="hover:bg-gray-5 w-full rounded-xl px-3 py-2 text-left text-caption-1 text-gray-1 transition"
            >
              네이버 지도 앱
            </button>
            <button
              type="button"
              onClick={() => handleNavigationLaunch('kakao')}
              className="hover:bg-gray-5 mt-1 w-full rounded-xl px-3 py-2 text-left text-caption-1 text-gray-1 transition"
            >
              카카오 지도 앱
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
