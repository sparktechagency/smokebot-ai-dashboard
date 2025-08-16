import { useEffect, useRef, useState } from 'react'
import { usePostChatMutation } from '../../Redux/chatApis'
import { useNavigate } from 'react-router-dom'

const UseVoiceChat = () => {
  const navigate = useNavigate()
  const [isListening, setIsListening] = useState(false)
  const [userMessage, setUserMessage] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [speaking, setSpeaking] = useState(false)
  const [chatHistory, setChatHistory] = useState([])
  const [conversationActive, setConversationActive] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isUserSpeaking, setIsUserSpeaking] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [noiseLevel, setNoiseLevel] = useState(0)
  const [postChat] = usePostChatMutation()

  const recognitionRef = useRef(null)
  const synthRef = useRef(null)
  const silenceTimerRef = useRef(null)
  const speechTimeoutRef = useRef(null)
  const restartTimeoutRef = useRef(null)

  // Enhanced mobile/tablet detection function
  const detectMobileDevice = () => {
    const userAgent = navigator.userAgent.toLowerCase()

    // Basic mobile device detection
    const basicMobileCheck =
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(
        userAgent
      )

    // Enhanced iPad detection (covers newer iPads that report as Mac)
    const iPadCheck =
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) ||
      /ipad/.test(userAgent) ||
      (navigator.userAgent.includes('Mac') && 'ontouchend' in document)

    // Screen size based detection for tablets
    const screenCheck =
      (window.screen.width <= 1024 && window.screen.height <= 1366) ||
      (window.screen.width <= 1366 && window.screen.height <= 1024)

    // Touch capability check
    const touchCheck = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    return basicMobileCheck || iPadCheck || (screenCheck && touchCheck)
  }

  useEffect(() => {
    if (
      !localStorage.getItem('user-id') &&
      !localStorage.getItem('phoneNumber')
    ) {
      navigate('/user-signup-have-account')
    }
  }, [])

  useEffect(() => {
    // Use the enhanced detection function
    setIsMobile(detectMobileDevice())

    // Also add resize listener to detect orientation changes on tablets
    const handleResize = () => {
      setIsMobile(detectMobileDevice())
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [])

  useEffect(() => {
    if (
      !('SpeechRecognition' in window) &&
      !('webkitSpeechRecognition' in window)
    ) {
      return
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()

    // Changed: Make continuous for both mobile and desktop
    recognitionRef.current.continuous = true
    recognitionRef.current.interimResults = true
    recognitionRef.current.lang = 'en-US'
    recognitionRef.current.maxAlternatives = 3

    recognitionRef.current.onstart = () => {
      setIsListening(true)
      setIsUserSpeaking(false)
    }

    recognitionRef.current.onresult = (event) => {
      let bestTranscript = ''
      let bestConfidence = 0
      let interimTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]

        if (result.isFinal) {
          for (let j = 0; j < result.length; j++) {
            const alternative = result[j]
            if (alternative.confidence > bestConfidence) {
              bestConfidence = alternative.confidence
              bestTranscript = alternative.transcript
            }
          }
        } else {
          interimTranscript += result[0].transcript
        }
      }

      if (interimTranscript || bestTranscript) {
        setIsUserSpeaking(true)

        // Stop AI speaking immediately when user starts talking
        if (speaking && synthRef.current) {
          synthRef.current.cancel()
          setSpeaking(false)
        }

        if (speechTimeoutRef.current) {
          clearTimeout(speechTimeoutRef.current)
        }

        speechTimeoutRef.current = setTimeout(() => {
          setIsUserSpeaking(false)
        }, 2000)
      }

      if (interimTranscript) {
        setUserMessage(interimTranscript)
      }

      if (bestTranscript && bestConfidence >= 0.7 && !isProcessing) {
        const cleanTranscript = bestTranscript.trim()

        setUserMessage(cleanTranscript)

        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current)
        }

        // Changed: Use same delay for both mobile and desktop for consistency
        silenceTimerRef.current = setTimeout(
          () => {
            if (cleanTranscript.length > 1) {
              processUserMessage(cleanTranscript)
            }
          },
          1500 // Consistent delay for both mobile and desktop
        )
      }
    }

    recognitionRef.current.onerror = (event) => {
      setIsListening(false)
      setIsUserSpeaking(false)

      // Changed: Auto-restart for both mobile and desktop when conversation is active
      if (event.error !== 'aborted' && conversationActive) {
        setTimeout(() => {
          startRecognition()
        }, 1000)
      }
    }

    recognitionRef.current.onend = () => {
      setIsListening(false)
      setIsUserSpeaking(false)

      // Changed: Auto-restart for both mobile and desktop when conversation is active
      if (conversationActive && !isProcessing && !speaking) {
        if (restartTimeoutRef.current) {
          clearTimeout(restartTimeoutRef.current)
        }
        restartTimeoutRef.current = setTimeout(() => {
          startRecognition()
        }, 500)
      }
    }

    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis
    }

    return () => {
      cleanup()
    }
  }, [conversationActive, speaking, isProcessing, isMobile])

  const startRecognition = () => {
    try {
      if (
        recognitionRef.current &&
        !isListening &&
        !speaking &&
        !isProcessing
      ) {
        recognitionRef.current.start()
      }
    } catch (error) {
      console.error('Start recognition error:', error)
    }
  }

  const stopRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop()
      } catch (error) {
        console.error('Error stopping recognition:', error)
      }
    }
    clearTimeouts()
    setIsListening(false)
    setIsUserSpeaking(false)
  }

  const clearTimeouts = () => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current)
    if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current)
  }

  const cleanup = () => {
    stopRecognition()
    if (synthRef.current) {
      synthRef.current.cancel()
    }
    setSpeaking(false)
    setIsProcessing(false)
  }

  const processUserMessage = async (message) => {
    if (!message || isProcessing) return

    const keywords = [
      'smoke',
      'smoky',
      'smokey',
      'smokebot',
      'products',
      'product',
      'bot',
      'chatbot',
      'store',
      'help',
      'buy',
      'purchase',
      'price',
      'restore',
    ]
    const messageWords = message.toLowerCase().split(' ')
    const hasKeyword = keywords.some((keyword) =>
      messageWords.some(
        (word) => word.includes(keyword) || keyword.includes(word)
      )
    )

    if (!hasKeyword) {
      return
    }

    setIsProcessing(true)
    setIsUserSpeaking(false)
    stopRecognition()

    try {
      const newUserMessage = {
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      }

      setChatHistory((prev) => [...prev, newUserMessage])
      setUserMessage('')

      await new Promise((resolve) => setTimeout(resolve, 800))

      const requestData = {
        userId: localStorage.getItem('user-id'),
        message: message,
      }

      const response = await postChat(requestData)

      const aiMessage = response?.data?.data?.aiReply

      const newAiMessage = {
        role: 'ai',
        content: aiMessage,
        timestamp: new Date().toISOString(),
      }

      setChatHistory((prev) => [...prev, newAiMessage])
      setAiResponse(aiMessage)

      setTimeout(() => {
        if (aiMessage && aiMessage.trim()) {
          speakText(aiMessage)
        } else {
          setIsProcessing(false)
          if (conversationActive && !isUserSpeaking) {
            setTimeout(() => {
              startRecognition()
            }, 500)
          }
        }
      }, 200)
    } catch (error) {
      const errorMessage =
        "Sorry, I'm having trouble right now. Please try again."

      const errorAiMessage = {
        role: 'ai',
        content: errorMessage,
        timestamp: new Date().toISOString(),
      }

      setChatHistory((prev) => [...prev, errorAiMessage])
      setAiResponse(errorMessage)

      setTimeout(() => speakText(errorMessage), 200)
    }
  }

  const speakText = (text) => {
    if (!soundEnabled) {
      setSpeaking(false)
      setIsProcessing(false)

      if (conversationActive && !isUserSpeaking) {
        setTimeout(() => {
          startRecognition()
        }, 300)
      }
      return
    }

    if (!synthRef.current || !text) {
      setIsProcessing(false)

      if (conversationActive && !isUserSpeaking) {
        setTimeout(() => {
          startRecognition()
        }, 300)
      }
      return
    }

    setSpeaking(true)

    if (synthRef.current.speaking) {
      synthRef.current.cancel()
      setTimeout(() => startSpeaking(), isMobile ? 500 : 100)
    } else {
      startSpeaking()
    }

    function startSpeaking() {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = isMobile ? 0.8 : 0.9
      utterance.pitch = 1.0
      utterance.volume = 1.0

      const voices = synthRef.current.getVoices()
      if (voices.length > 0) {
        const selectedVoice =
          voices.find(
            (voice) => voice.lang.startsWith('en') && voice.localService
          ) || voices[0]
        utterance.voice = selectedVoice
      }

      utterance.onstart = () => {
        setSpeaking(true)
      }

      utterance.onend = () => {
        setSpeaking(false)
        setIsProcessing(false)

        if (conversationActive && !isUserSpeaking) {
          setTimeout(
            () => {
              startRecognition()
            },
            isMobile ? 1000 : 500
          )
        }
      }

      utterance.onerror = (event) => {
        setSpeaking(false)
        setIsProcessing(false)

        if (conversationActive && !isUserSpeaking) {
          setTimeout(() => {
            startRecognition()
          }, 1000)
        }
      }

      if (!soundEnabled) {
        setSpeaking(false)
        setIsProcessing(false)

        if (conversationActive && !isUserSpeaking) {
          setTimeout(() => {
            startRecognition()
          }, 300)
        }
        return
      }

      synthRef.current.speak(utterance)
    }
  }

  const toggleConversation = () => {
    if (conversationActive) {
      setConversationActive(false)
      cleanup()
    } else {
      setConversationActive(true)
      setIsProcessing(false)
      // Changed: Start recognition for both mobile and desktop
      setTimeout(() => startRecognition(), 1000)
    }
  }

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const newState = !prev

      if (!newState && speaking && synthRef.current) {
        synthRef.current.cancel()
        setSpeaking(false)
        if (conversationActive && !isProcessing && !isUserSpeaking) {
          setTimeout(() => startRecognition(), 500)
        }
      }
      return newState
    })
  }

  return {
    isListening,
    userMessage,
    aiResponse,
    speaking,
    chatHistory,
    conversationActive,
    isProcessing,
    isUserSpeaking,
    soundEnabled,
    isMobile,
    noiseLevel,
    toggleConversation,
    toggleSound,
    startRecognition,
    stopRecognition,
    processUserMessage,
  }
}

export default UseVoiceChat
