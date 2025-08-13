import { useEffect, useRef, useState } from 'react'

const UseVoiceChat = () => {
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

  const recognitionRef = useRef(null)
  const synthRef = useRef(null)
  const silenceTimerRef = useRef(null)
  const speechTimeoutRef = useRef(null)
  const restartTimeoutRef = useRef(null)

  // Detect mobile device
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase()
    const mobileCheck =
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(
        userAgent
      )
    setIsMobile(mobileCheck)
  }, [])

  // Initialize speech recognition
  useEffect(() => {
    if (
      !('SpeechRecognition' in window) &&
      !('webkitSpeechRecognition' in window)
    ) {
      console.error('Speech recognition not supported')
      return
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()

    recognitionRef.current.continuous = !isMobile // Continuous only on desktop
    recognitionRef.current.interimResults = true
    recognitionRef.current.lang = 'en-US'
    recognitionRef.current.maxAlternatives = 3

    recognitionRef.current.onstart = () => {
      console.log('Speech recognition started')
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
        console.log(
          'Processing transcript:',
          cleanTranscript,
          'Confidence:',
          bestConfidence
        )

        setUserMessage(cleanTranscript)

        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current)
        }

        silenceTimerRef.current = setTimeout(
          () => {
            if (cleanTranscript.length > 1) {
              processUserMessage(cleanTranscript)
            }
          },
          isMobile ? 1000 : 2000
        )
      }
    }

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
      setIsUserSpeaking(false)

      if (event.error !== 'aborted' && conversationActive && !isMobile) {
        setTimeout(() => {
          startRecognition()
        }, 1000)
      }
    }

    recognitionRef.current.onend = () => {
      console.log('Speech recognition ended')
      setIsListening(false)
      setIsUserSpeaking(false)

      // Auto-restart only on desktop for continuous listening
      if (conversationActive && !isProcessing && !speaking && !isMobile) {
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
      if (recognitionRef.current && !isListening && !speaking) {
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
    if (!message || message.length < 2 || isProcessing) return

    const keywords = [
      'smoke',
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
    ]
    const messageWords = message.toLowerCase().split(' ')
    const hasKeyword = keywords.some((keyword) =>
      messageWords.some(
        (word) => word.includes(keyword) || keyword.includes(word)
      )
    )

    if (!hasKeyword) {
      console.log('Message does not contain required keywords:', message)
      return
    }

    console.log('Processing message:', message)
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

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const aiMessage = `Thank you for asking about "${message}". I'm here to help you with our smoke products and services. How can I assist you further?`

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
          if (conversationActive && !isUserSpeaking && !isMobile) {
            setTimeout(() => startRecognition(), 500)
          }
        }
      }, 200)
    } catch (error) {
      console.error('Processing error:', error)
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
      console.log('Sound disabled - not speaking')
      setSpeaking(false)
      setIsProcessing(false)

      if (conversationActive && !isUserSpeaking && !isMobile) {
        setTimeout(() => startRecognition(), 300)
      }
      return
    }

    if (!synthRef.current || !text) {
      console.log('Speech synthesis not available or no text provided')
      setIsProcessing(false)

      if (conversationActive && !isUserSpeaking && !isMobile) {
        setTimeout(() => startRecognition(), 300)
      }
      return
    }

    console.log('Speaking text:', text)
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
        console.log('Speech started')
        setSpeaking(true)
      }

      utterance.onend = () => {
        console.log('Speech ended')
        setSpeaking(false)
        setIsProcessing(false)

        if (conversationActive && !isUserSpeaking && !isMobile) {
          setTimeout(() => startRecognition(), isMobile ? 800 : 500)
        }
      }

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event)
        setSpeaking(false)
        setIsProcessing(false)

        if (conversationActive && !isUserSpeaking && !isMobile) {
          setTimeout(() => startRecognition(), 1000)
        }
      }

      if (!soundEnabled) {
        console.log('Sound was disabled while preparing to speak')
        setSpeaking(false)
        setIsProcessing(false)

        if (conversationActive && !isUserSpeaking && !isMobile) {
          setTimeout(() => startRecognition(), 300)
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
      if (!isMobile) {
        setTimeout(() => startRecognition(), 1000)
      }
    }
  }

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const newState = !prev
      if (!newState && speaking && synthRef.current) {
        synthRef.current.cancel()
        setSpeaking(false)
        if (
          conversationActive &&
          !isProcessing &&
          !isUserSpeaking &&
          !isMobile
        ) {
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
