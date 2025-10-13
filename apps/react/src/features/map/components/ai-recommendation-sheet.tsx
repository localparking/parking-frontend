import { useCallback, useEffect, useRef, useState, type FormEvent, type SetStateAction } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Mic, Send, X } from 'lucide-react'

interface AiRecommendationSheetProps {
  open: boolean
  onClose: () => void
}

export const AiRecommendationSheet = ({ open, onClose }: AiRecommendationSheetProps) => {
  const [transcript, setTranscript] = useState('')
  const [manualInput, setManualInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  const recognitionRef = useRef<any>(null)
  const silenceTimerRef = useRef<number | null>(null)
  const autoRequestRef = useRef(false)
  const restartOnEndRef = useRef(false)
  const transcriptRef = useRef(transcript)

  useEffect(() => {
    transcriptRef.current = transcript
  }, [transcript])

  const shortQueryGuide = '검색 결과가 없어요\n위치, 시간, 가게 종류를 알려주세요'

  const updateTranscript = useCallback((value: SetStateAction<string>) => {
    setTranscript((prev) => {
      const next = typeof value === 'function' ? (value as (val: string) => string)(prev) : value
      transcriptRef.current = next
      return next
    })
  }, [])

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current !== null) {
      window.clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }
  }, [])

  const handleSearch = useCallback((_query: string) => {
    // TODO: implement AI recommendation search with the provided query
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

  const handleSilenceTimeout = useCallback(() => {
    const trimmed = transcriptRef.current.trim()
    if (trimmed.length > 8) {
      setStatusMessage(null)
      setError(null)
      stopListening({ restart: false })
      handleSearch(trimmed)
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
      recognition.interimResults = false

      recognition.onstart = () => {
        setStatusMessage(null)
        setIsListening(true)
        startSilenceTimer()
      }

      recognition.onresult = (event: any) => {
        const results: string[] = Array.from(event.results)
          .slice(event.resultIndex)
          .map((res: any) => res[0]?.transcript?.trim() ?? '')
          .filter(Boolean)

        if (results.length > 0) {
          const combined = results.join(' ')
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
      setManualInput('')
      setError(null)
      if (value.length <= 8) {
        setStatusMessage(shortQueryGuide)
        stopListening({ restart: false })
        return
      }
      setStatusMessage(null)
      stopListening({ restart: false })
      handleSearch(value)
    },
    [handleSearch, manualInput, shortQueryGuide, stopListening, updateTranscript]
  )

  const handleClose = useCallback(() => {
    stopListening()
    updateTranscript('')
    setManualInput('')
    setStatusMessage(null)
    setError(null)
    onClose()
  }, [onClose, stopListening, updateTranscript])

  useEffect(() => {
    if (!open) {
      autoRequestRef.current = false
      stopListening()
      return
    }

    if (!autoRequestRef.current) {
      autoRequestRef.current = true
      startListening()
    }
  }, [open, startListening, stopListening])

  useEffect(() => {
    if (open && !isListening && restartOnEndRef.current) {
      restartOnEndRef.current = false
      startListening()
    }
  }, [isListening, open, startListening])

  useEffect(() => {
    return () => {
      stopListening()
      recognitionRef.current = null
    }
  }, [stopListening])

  const placeholderTranscript = '말씀해주세요...'

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

            <div className="flex h-full flex-col items-center gap-6 py-6">
              <div className="text-center">
                <h2 className="text-body-3 text-gray-1">목적지를 말씀해주세요</h2>
                <p className="mt-1 text-caption-1 text-gray-3">
                  {isListening ? 'AI가 음성을 듣고 있어요.' : '마이크 아이콘을 눌러 다시 말씀하실 수 있어요.'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleToggleListening}
                className="relative flex h-[160px] w-[160px] items-center justify-center focus:outline-none"
              >
                <span
                  className={`absolute inset-0 rounded-full transition ${
                    isListening ? 'animate-ping bg-primary-2/60' : 'bg-primary-2/20'
                  }`}
                />
                <span className="relative flex h-[140px] w-[140px] items-center justify-center rounded-full bg-primary-2">
                  <span className="flex h-[104px] w-[104px] items-center justify-center rounded-full bg-white shadow-lg">
                    <Mic className={`h-16 w-16 ${isListening ? 'text-primary-1' : 'text-gray-3'}`} />
                  </span>
                </span>
              </button>

              <div className="w-full flex-1 overflow-hidden">
                <div className="flex h-full flex-col items-center justify-center gap-2 rounded-2xl bg-gray-5 px-6 py-6 text-center">
                  <p className="whitespace-pre-line text-body-3 text-gray-1">
                    {transcript || (error ? '' : placeholderTranscript)}
                  </p>
                  {statusMessage && (
                    <p className="whitespace-pre-line text-caption-1 text-gray-3">{statusMessage}</p>
                  )}
                  {error && <p className="text-caption-2 text-red-500">{error}</p>}
                </div>
              </div>

              <form
                onSubmit={handleManualSubmit}
                className="bg-gray-5 mt-auto flex w-full items-center gap-3 rounded-full border border-gray-4 px-5 py-3"
              >
                <input
                  type="text"
                  value={manualInput}
                  onChange={(event) => {
                    setManualInput(event.target.value)
                    setStatusMessage(null)
                  }}
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
