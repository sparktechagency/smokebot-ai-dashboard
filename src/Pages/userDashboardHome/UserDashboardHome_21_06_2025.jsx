import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Loader,
  Settings,
  AlertCircle,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { TbLogout } from 'react-icons/tb'
import { jwtDecode } from 'jwt-decode'
import { useEffect, useRef, useState } from 'react'
import { usePostChatMutation } from '../../Redux/chatApis'
import { useGetAllFeaturesQuery } from '../../Redux/featuresApis'

const Navbar = () => {
  const navigate = useNavigate()
  const [timeLeft, setTimeLeft] = useState(300)

  useEffect(() => {
    if (
      !localStorage.getItem('user-id') &&
      !localStorage.getItem('phoneNumber')
    ) {
      navigate('/user-signup-have-account')
    }
  }, [])

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSession()
      return
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  const handleSession = () => {
    navigate('/user-signup-have-account')
    localStorage.removeItem('phoneNumber')
    localStorage.removeItem('user-id')
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  return (
    <div className="flex items-center justify-end rounded-md w-full">
      <div className="flex items-center justify-between w-full bg-gray-200 px-2">
        <div className="text-2xl font-bold">
          <span className="text-blue-500">SmokeBot</span> Chatbot
        </div>

        <div className="bg-blue-500 px-3 py-0.5">
          <div className="text-sm text-gray-100">Session Time</div>
          <div className="text-2xl font-semibold text-center">
            {formatTime(timeLeft)}
          </div>
        </div>

        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={handleSession}
        >
          <div className="text-md border p-2 border-gray-300 rounded-md flex items-center gap-2 bg-white hover:text-red-500">
            End Session <TbLogout />
          </div>
        </div>
      </div>
    </div>
  )
}

const UserDashboardHome = () => {
  const [isListening, setIsListening] = useState(false)
  const [userMessage, setUserMessage] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [speaking, setSpeaking] = useState(false)
  const [chatHistory, setChatHistory] = useState([])
  const [conversationActive, setConversationActive] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isUserSpeaking, setIsUserSpeaking] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(true)

  // Enhanced noise handling states
  const [noiseLevel, setNoiseLevel] = useState(0)
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.7)
  const [speechSettings, setSpeechSettings] = useState({
    noiseSuppression: true,
    echoCancellation: true,
    autoGainControl: true,
    sensitivity: 'high', // high, medium, low
  })
  const [audioContext, setAudioContext] = useState(null)
  const [audioAnalyser, setAudioAnalyser] = useState(null)
  const [microphoneStream, setMicrophoneStream] = useState(null)
  const [isCalibrating, setIsCalibrating] = useState(false)
  const [backgroundNoiseLevel, setBackgroundNoiseLevel] = useState(0)
  const [showSettings, setShowSettings] = useState(false)

  const [postChat] = usePostChatMutation()

  const recognitionRef = useRef(null)
  const synthRef = useRef(null)
  const silenceTimerRef = useRef(null)
  const speechTimeoutRef = useRef(null)
  const chatContainerRef = useRef(null)
  const restartTimeoutRef = useRef(null)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const micStreamRef = useRef(null)
  const noiseCalibrationRef = useRef(null)

  const [features, setFeatures] = useState([])
  const decodedToken = jwtDecode(localStorage.getItem('token'))
  const { data: getAllFeatures } = useGetAllFeaturesQuery({
    store: decodedToken?.profileId,
    isFeatured: true,
  })

  // Detect mobile device
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase()
    const mobileCheck =
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(
        userAgent
      )
    setIsMobile(mobileCheck)
    console.log('Mobile device detected:', mobileCheck)
  }, [])

  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatHistory])

  // Initialize audio context and noise monitoring
  useEffect(() => {
    initializeAudioAnalysis()
    return () => {
      cleanupAudioAnalysis()
    }
  }, [])

  const initializeAudioAnalysis = async () => {
    try {
      // Request microphone access with enhanced constraints
      const constraints = {
        audio: {
          echoCancellation: speechSettings.echoCancellation,
          noiseSuppression: speechSettings.noiseSuppression,
          autoGainControl: speechSettings.autoGainControl,
          sampleRate: 44100,
          channelCount: 1,
        },
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      setMicrophoneStream(stream)
      micStreamRef.current = stream

      // Create audio context for noise analysis
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      const analyser = audioCtx.createAnalyser()
      const microphone = audioCtx.createMediaStreamSource(stream)

      analyser.fftSize = 2048
      analyser.minDecibels = -90
      analyser.maxDecibels = -10
      analyser.smoothingTimeConstant = 0.85

      microphone.connect(analyser)

      setAudioContext(audioCtx)
      setAudioAnalyser(analyser)
      audioContextRef.current = audioCtx
      analyserRef.current = analyser

      // Start noise monitoring
      startNoiseMonitoring()

      // Auto-calibrate background noise
      setTimeout(() => {
        calibrateBackgroundNoise()
      }, 1000)
    } catch (error) {
      console.error('Error initializing audio analysis:', error)
    }
  }

  const startNoiseMonitoring = () => {
    if (!analyserRef.current) return

    const analyser = analyserRef.current
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const monitor = () => {
      analyser.getByteFrequencyData(dataArray)

      // Calculate average volume level
      let sum = 0
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i]
      }
      const average = sum / bufferLength

      setNoiseLevel(average)

      // Continue monitoring
      requestAnimationFrame(monitor)
    }

    monitor()
  }

  const calibrateBackgroundNoise = () => {
    setIsCalibrating(true)
    const samples = []
    let sampleCount = 0
    const maxSamples = 30 // 3 seconds of samples

    const calibrate = () => {
      if (sampleCount < maxSamples) {
        samples.push(noiseLevel)
        sampleCount++
        setTimeout(calibrate, 100)
      } else {
        // Calculate average background noise
        const avgNoise = samples.reduce((a, b) => a + b, 0) / samples.length
        setBackgroundNoiseLevel(avgNoise)
        setIsCalibrating(false)

        // Adjust confidence threshold based on noise level
        const dynamicThreshold = Math.max(
          0.6,
          Math.min(0.9, 0.8 - avgNoise / 100)
        )
        setConfidenceThreshold(dynamicThreshold)

        console.log(
          'Background noise calibrated:',
          avgNoise,
          'Threshold:',
          dynamicThreshold
        )
      }
    }

    calibrate()
  }

  const cleanupAudioAnalysis = () => {
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop())
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close()
    }
  }

  useEffect(() => {
    // Check speech recognition support
    if (
      !('SpeechRecognition' in window) &&
      !('webkitSpeechRecognition' in window)
    ) {
      console.error('Speech recognition not supported in this browser')
      setSpeechSupported(false)
      return
    }

    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis
    }

    initializeSpeechRecognition()

    return () => {
      cleanup()
    }
  }, [speechSettings, confidenceThreshold])

  // Load voices when component mounts
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = speechSynthesis.getVoices()
        console.log('Available voices:', voices.length)

        // On mobile, sometimes voices load later
        if (voices.length === 0 && isMobile) {
          setTimeout(loadVoices, 1000)
          return
        }

        voices.forEach((voice, index) => {
          console.log(`${index}: ${voice.name} (${voice.lang})`)
        })
      }

      loadVoices()
      speechSynthesis.onvoiceschanged = loadVoices
    }
  }, [isMobile])

  const initializeSpeechRecognition = () => {
    if (
      !('SpeechRecognition' in window) &&
      !('webkitSpeechRecognition' in window)
    ) {
      setSpeechSupported(false)
      return false
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()

    // Enhanced settings for noisy environments
    recognitionRef.current.continuous = true
    recognitionRef.current.interimResults = true
    recognitionRef.current.lang = 'en-US'
    recognitionRef.current.maxAlternatives = 3 // Get multiple alternatives

    recognitionRef.current.onstart = () => {
      console.log('Speech recognition started')
      setIsListening(true)
      setIsUserSpeaking(false)
    }

   recognitionRef.current.onresult = (event) => {
  let bestTranscript = ''
  let bestConfidence = 0
  let interimTranscript = ''
  let hasHighConfidenceResult = false

  // Process all results and find the best one
  for (let i = event.resultIndex; i < event.results.length; i++) {
    const result = event.results[i]

    if (result.isFinal) {
      // Check all alternatives for the best confidence
      for (let j = 0; j < result.length; j++) {
        const alternative = result[j]
        if (alternative.confidence > bestConfidence) {
          bestConfidence = alternative.confidence
          bestTranscript = alternative.transcript
        }
      }

      // Only accept results above our confidence threshold
      if (bestConfidence >= confidenceThreshold) {
        hasHighConfidenceResult = true
      }
    } else {
      // Handle interim results
      const transcript = result[0].transcript
      interimTranscript += transcript
    }
  }

  // Adjust for noise level - require higher confidence in noisy environments
  const noiseAdjustedThreshold =
    confidenceThreshold + (noiseLevel > backgroundNoiseLevel + 20 ? 0.1 : 0)

  // Set user speaking state when there's speech input
  if (interimTranscript || bestTranscript) {
    setIsUserSpeaking(true)

    // Stop AI speech when user starts speaking
    if (speaking && synthRef.current) {
      synthRef.current.cancel()
      setSpeaking(false)
    }

    // Clear speech timeout and set new one
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current)
    }

    speechTimeoutRef.current = setTimeout(() => {
      setIsUserSpeaking(false)
    }, 2000) // Longer timeout for noisy environments
  }

  // Update display with interim results
  if (interimTranscript && !isMobile) {
    setUserMessage(interimTranscript)
  }

  // Process final transcript only if confidence is high enough
  if (
    hasHighConfidenceResult &&
    bestTranscript &&
    !isProcessing &&
    bestConfidence >= noiseAdjustedThreshold
  ) {
    const cleanTranscript = bestTranscript.trim()
    console.log(
      'High confidence transcript:',
      cleanTranscript,
      'Confidence:',
      bestConfidence
    )

    setUserMessage(cleanTranscript)

    // Clear any existing timer
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
    }

    // Process after a delay to allow for more speech
    const delay = isMobile ? 1000 : 2500 // Longer delay for better accuracy
    silenceTimerRef.current = setTimeout(async () => {
      if (cleanTranscript.length > 1) {
        // Don't call stopAudioRecording here - let processUserMessage handle it
        processUserMessage(cleanTranscript)
      }
    }, delay)
  } else if (bestTranscript && bestConfidence < noiseAdjustedThreshold) {
    console.log(
      'Low confidence transcript rejected:',
      bestTranscript,
      'Confidence:',
      bestConfidence
    )
  }
}

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
      setIsUserSpeaking(false)

      switch (event.error) {
        case 'not-allowed':
          alert(
            'Microphone access denied. Please allow microphone permissions and refresh the page.'
          )
          break
        case 'no-speech':
          console.log(
            'No speech detected - this is normal in noisy environments'
          )
          // More aggressive restart in noisy environments
          if (conversationActive) {
            setTimeout(() => {
              startRecognition()
            }, 500)
          }
          break
        case 'aborted':
          console.log('Speech recognition aborted')
          break
        case 'network':
          console.log('Network error in speech recognition')
          if (conversationActive) {
            setTimeout(() => {
              startRecognition()
            }, 3000)
          }
          break
        case 'audio-capture':
          console.log('Audio capture error - checking microphone')
          // Try to reinitialize audio
          setTimeout(() => {
            initializeAudioAnalysis()
            if (conversationActive) {
              startRecognition()
            }
          }, 2000)
          break
        default:
          console.error('Speech recognition error:', event.error)
          if (conversationActive) {
            setTimeout(() => {
              startRecognition()
            }, 1500)
          }
      }
    }

    recognitionRef.current.onend = () => {
      console.log('Speech recognition ended')
      setIsListening(false)
      setIsUserSpeaking(false)

      // Clear any pending restart
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current)
      }

      // More aggressive restart for continuous listening in store environment
      if (conversationActive && !isProcessing && !speaking) {
        restartTimeoutRef.current = setTimeout(
          () => {
            startRecognition()
          },
          isMobile ? 300 : 500 // Faster restart
        )
      }
    }
    return true
  }

  useEffect(() => {
    if (conversationActive && !speaking && !isProcessing && !isUserSpeaking) {
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current)
      }
      restartTimeoutRef.current = setTimeout(() => {
        startRecognition()
      }, 300) // Quick restart
    } else if (!conversationActive) {
      stopRecognition()
    }
  }, [conversationActive, speaking, isProcessing, isUserSpeaking])

  const startRecognition = async () => {
    try {
      // Enhanced microphone permission handling
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('getUserMedia is not supported in this browser/context')
        alert(
          'Please use Chrome, Safari, or Edge with HTTPS for voice features'
        )
        return
      }

      if (recognitionRef.current && !isListening && !speaking) {
        try {
          recognitionRef.current.start()
        } catch (startError) {
          console.error('Failed to start recognition:', startError)
          // Try again after a short delay
          setTimeout(() => {
            if (conversationActive && !isListening && !speaking) {
              try {
                recognitionRef.current.start()
              } catch (retryError) {
                console.error('Retry failed:', retryError)
                // Reinitialize recognition if it keeps failing
                initializeSpeechRecognition()
              }
            }
          }, 1000)
        }
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
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
    }
    if (speechTimeoutRef.current) {
      clearTimeout(speechTimeoutRef.current)
    }
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current)
    }
    setIsListening(false)
    setIsUserSpeaking(false)
  }

  const cleanup = () => {
    stopRecognition()
    if (synthRef.current) {
      synthRef.current.cancel()
    }
    cleanupAudioAnalysis()
    setSpeaking(false)
    setIsProcessing(false)
  }

  const toggleConversation = () => {
    if (conversationActive) {
      setConversationActive(false)
    } else {
      setConversationActive(true)
      setIsProcessing(false)
      // Recalibrate when restarting
      setTimeout(() => {
        calibrateBackgroundNoise()
      }, 500)
    }
  }

  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const newState = !prev
      console.log('Sound toggled to:', newState)

      if (!newState && speaking && synthRef.current) {
        console.log('Stopping speech due to sound disable')
        synthRef.current.cancel()
        setSpeaking(false)

        if (conversationActive && !isProcessing && !isUserSpeaking) {
          setTimeout(() => {
            startRecognition()
          }, 500)
        }
      }

      return newState
    })
  }

  const processUserMessage = async (message) => {
    if (!message || message.length < 2 || isProcessing) {
      return
    }

    // Enhanced keyword detection with better matching
    const keywords = [
      'smoke',
      'smokebot',
      'products',
      'product',
      'bot',
      'chatbot',
      'store',
      'restore',
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

      setChatHistory((prev) => {
        const updated = [...prev, newUserMessage]
        console.log('Updated chat history with user message:', updated)
        return updated
      })

      setUserMessage('')

      const requestData = {
        userId: localStorage.getItem('user-id'),
        message: message,
      }

      console.log('Sending chat request:', requestData)

      const response = await postChat(requestData)
      console.log('Chat response:', response)

      const aiMessage = response?.data?.data?.aiReply
      console.log('AI Message to speak:', aiMessage)

      const newAiMessage = {
        role: 'ai',
        content: aiMessage,
        timestamp: new Date().toISOString(),
      }

      setChatHistory((prev) => {
        const updated = [...prev, newAiMessage]
        console.log('Updated chat history with AI message:', updated)
        return updated
      })

      setAiResponse(aiMessage)

      // Start text-to-speech after a brief delay
      setTimeout(() => {
        if (aiMessage && aiMessage.trim()) {
          console.log('Processing AI response for speech/text:', aiMessage)
          speakText(aiMessage)
        } else {
          // If no message, resume listening
          setIsProcessing(false)
          if (conversationActive && !isUserSpeaking) {
            setTimeout(() => {
              startRecognition()
            }, 500)
          }
        }
      }, 200)
    } catch (error) {
      console.error('Chat API error:', error)

      let errorMessage =
        "Sorry, I'm having trouble connecting right now. Please try again."

      if (error?.status === 404) {
        errorMessage =
          'API endpoint not found. Please check your server configuration.'
      } else if (error?.status >= 500) {
        errorMessage = 'Server error. Please try again later.'
      } else if (error?.data?.message) {
        errorMessage = `Error: ${error.data.message}`
      } else if (error?.message) {
        errorMessage = `Error: ${error.message}`
      }

      const errorAiMessage = {
        role: 'ai',
        content: errorMessage,
        timestamp: new Date().toISOString(),
      }

      setChatHistory((prev) => [...prev, errorAiMessage])
      setAiResponse(errorMessage)

      setTimeout(() => {
        speakText(errorMessage)
      }, 200)
    }
  }

  useEffect(() => {
    if (!soundEnabled && speaking && synthRef.current) {
      console.log('Sound disabled - stopping current speech')
      synthRef.current.cancel()
      setSpeaking(false)
      setIsProcessing(false)

      if (conversationActive && !isUserSpeaking) {
        setTimeout(() => {
          startRecognition()
        }, 500)
      }
    }
  }, [soundEnabled, speaking, conversationActive, isUserSpeaking])

  const speakText = (text) => {
    if (!soundEnabled) {
      console.log('Sound disabled - not speaking')
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
      console.log('Speech synthesis not available or no text provided')
      setIsProcessing(false)

      if (conversationActive && !isUserSpeaking) {
        setTimeout(() => {
          startRecognition()
        }, 300)
      }
      return
    }

    if (!('speechSynthesis' in window)) {
      console.error('Speech synthesis not supported in this browser')
      setIsProcessing(false)

      if (conversationActive && !isUserSpeaking) {
        setTimeout(() => {
          startRecognition()
        }, 300)
      }
      return
    }

    console.log('Speaking text:', text)
    setSpeaking(true)

    // Cancel any ongoing speech - important for mobile
    if (synthRef.current.speaking) {
      synthRef.current.cancel()
      // Wait a bit for cancellation to complete on mobile
      setTimeout(
        () => {
          startSpeaking()
        },
        isMobile ? 500 : 100
      )
    } else {
      startSpeaking()
    }

    function startSpeaking() {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = isMobile ? 0.7 : 0.8 // Slower for better clarity in noisy environment
      utterance.pitch = 1.0
      utterance.volume = 1.0

      // Voice selection with mobile compatibility
      const voices = synthRef.current.getVoices()
      if (voices.length > 0) {
        let selectedVoice

        if (isMobile) {
          // On mobile, prefer any English voice
          selectedVoice =
            voices.find(
              (voice) =>
                voice.lang.startsWith('en') &&
                (voice.name.toLowerCase().includes('google') ||
                  voice.name.toLowerCase().includes('samantha') ||
                  voice.localService)
            ) ||
            voices.find((voice) => voice.lang.startsWith('en')) ||
            voices[0]
        } else {
          // Desktop voice selection - prefer clearer voices for noisy environments
          selectedVoice =
            voices.find(
              (voice) =>
                voice.lang.startsWith('en') &&
                voice.localService &&
                (voice.name.toLowerCase().includes('premium') ||
                  voice.name.toLowerCase().includes('enhanced'))
            ) ||
            voices.find(
              (voice) => voice.lang.startsWith('en') && voice.localService
            ) ||
            voices[0]
        }

        utterance.voice = selectedVoice
        console.log('Selected voice:', selectedVoice?.name)
      }

      utterance.onstart = () => {
        console.log('Speech started')
        if (!soundEnabled) {
          console.log('Sound was disabled after speech started - cancelling')
          synthRef.current.cancel()
          setSpeaking(false)
          setIsProcessing(false)

          if (conversationActive && !isUserSpeaking) {
            setTimeout(() => {
              startRecognition()
            }, 300)
          }
          return
        }
        setSpeaking(true)
      }

      utterance.onend = () => {
        console.log('Speech ended')
        setSpeaking(false)
        setIsProcessing(false)

        // Resume listening after AI finishes speaking
        if (conversationActive && !isUserSpeaking) {
          setTimeout(
            () => {
              startRecognition()
            },
            isMobile ? 800 : 500 // Longer delay to avoid echo
          )
        }
      }

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event)
        setSpeaking(false)
        setIsProcessing(false)

        if (conversationActive && !isUserSpeaking) {
          setTimeout(() => {
            startRecognition()
          }, 1000)
        }
      }

      // Final check before speaking
      if (!soundEnabled) {
        console.log('Sound was disabled while preparing to speak')
        setSpeaking(false)
        setIsProcessing(false)

        if (conversationActive && !isUserSpeaking) {
          setTimeout(() => {
            startRecognition()
          }, 300)
        }
        return
      }

      console.log('Calling speechSynthesis.speak()')
      synthRef.current.speak(utterance)
    }
  }

  useEffect(() => {
    if (getAllFeatures) {
      setFeatures(getAllFeatures?.data?.result)
    }
  }, [getAllFeatures])

  return (
    <>
      <Navbar />  
      <div className="bg-gray-100 min-h-screen p-4">
        <div className="flex flex-col justify-between h-[calc(100vh-100px)]">
          <div className="flex justify-between gap-5 flex-1">
            {/* Chat History - Messenger Style */}
            <div className="flex-1 bg-white rounded-lg shadow flex flex-col w-3/4">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Conversation</h2>
              </div>  

              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-3"
                style={{ maxHeight: 'calc(100vh - 300px)' }}
              >
                {chatHistory.length === 0 ? (
                  <div className="flex items-center justify-center text-gray-400 h-full">
                    <p>
                      Start a new conversation by speaking a command. For
                      example, for every question use this &quot;smoke&quot; or
                      &quot;smokebot&quot; or &quot;bot&quot; or
                      &quot;product&quot; keyword.
                    </p>
                  </div>
                ) : (
                  <>
                    {chatHistory.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          message.role === 'user'
                            ? 'justify-end'
                            : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                            message.role === 'user'
                              ? 'bg-blue-500 text-white rounded-br-md'
                              : 'bg-gray-200 text-gray-800 rounded-bl-md'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <span
                            className={`text-xs block mt-1 ${
                              message.role === 'user'
                                ? 'text-blue-100'
                                : 'text-gray-500'
                            }`}
                          >
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ))}

                    {/* Show processing indicator */}
                    {isProcessing && (
                      <div className="flex justify-start">
                        <div className="bg-gray-200 text-gray-800 rounded-2xl rounded-bl-md px-4 py-2">
                          <div className="flex items-center space-x-2">
                            <Loader className="animate-spin" size={16} />
                            <p className="text-sm">Processing...</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Show user typing indicator */}
                    {isUserSpeaking && userMessage && (
                      <div className="flex justify-end">
                        <div className="bg-blue-500 text-white rounded-2xl rounded-br-md px-4 py-2 max-w-xs lg:max-w-md">
                          <p className="text-sm opacity-70">{userMessage}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            <div
                              className="w-2 h-2 bg-white rounded-full animate-pulse"
                              style={{ animationDelay: '0.2s' }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-white rounded-full animate-pulse"
                              style={{ animationDelay: '0.4s' }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Features Panel */}
            <div className="w-1/4 bg-white rounded-lg shadow">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Features</h2>
              </div>
              <div
                className="p-4 space-y-2 overflow-y-auto"
                style={{ maxHeight: 'calc(100vh - 300px)' }}
              >
                {features?.map((feature) => (
                  <div
                    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                    key={feature?._id}
                  >
                    <p className="text-sm text-gray-700">{feature?.name}</p>
                    {/* <p className="font-semibold text-green-600">
                      ${feature?.price}
                    </p> */}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Controls */}
          <div className="bg-white rounded-lg shadow p-4 mt-4">
            {/* Voice Status Indicator */}
            <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isUserSpeaking
                        ? 'bg-red-500 animate-pulse'
                        : speaking
                        ? 'bg-green-500 animate-pulse'
                        : isListening
                        ? 'bg-blue-500 animate-pulse'
                        : 'bg-gray-300'
                    }`}
                  ></div>
                  <span className="text-sm font-medium">
                    {isUserSpeaking
                      ? 'You are speaking...'
                      : speaking
                      ? 'AI is responding...'
                      : isListening
                      ? 'Listening for your voice...'
                      : conversationActive
                      ? 'Ready to listen'
                      : 'Conversation stopped'}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Sound Toggle Button */}
                  <button
                    onClick={toggleSound}
                    className={`p-2 rounded-full transition-all duration-200 ${
                      soundEnabled
                        ? 'bg-green-100 text-green-600 hover:bg-green-200'
                        : 'bg-red-100 text-red-600 hover:bg-red-200'
                    }`}
                    title={
                      soundEnabled
                        ? 'Sound Enabled - Click to Mute'
                        : 'Sound Disabled - Click to Enable'
                    }
                  >
                    {soundEnabled ? (
                      <Volume2 size={18} />
                    ) : (
                      <VolumeX size={18} />
                    )}
                  </button>

                  {speaking && soundEnabled && (
                    <Volume2
                      size={20}
                      className="text-green-600 animate-pulse"
                    />
                  )}
                </div>
              </div>

              {/* Current message preview */}
              {(userMessage || aiResponse) && (
                <div className="mt-2 text-sm text-gray-600">
                  {isUserSpeaking && userMessage ? (
                    <span className="italic">{userMessage}</span>
                  ) : (
                    aiResponse && (
                      <span>
                        Last response: {aiResponse.substring(0, 100)}...
                      </span>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Browser Compatibility Warning */}
            {!('SpeechRecognition' in window) &&
              !('webkitSpeechRecognition' in window) && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-700 text-sm">
                    <strong>Browser Notice:</strong> Speech recognition is not
                    supported in this browser. Please use Chrome or Edge for the
                    best experience.
                  </p>
                </div>
              )}

            {/* Main Control Button */}
            {/* <div className="flex justify-center">
              <button
                onClick={toggleConversation}
                disabled={isProcessing}
                className={`p-6 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ease-in-out transform hover:scale-105 ${
                  conversationActive
                    ? 'bg-red-500 hover:bg-red-600 ring-4 ring-red-200'
                    : 'bg-blue-500 hover:bg-blue-600 ring-4 ring-blue-200'
                } text-white ${
                  isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isProcessing ? (
                  <Loader className="animate-spin" size={32} />
                ) : conversationActive ? (
                  <MicOff size={32} />
                ) : (
                  <Mic size={32} />
                )}
              </button>
            </div> */}

            {/* Status Text */}
            <div className="text-center mt-3">
              <span className="text-sm text-gray-600">
                {isProcessing
                  ? 'Processing your message...'
                  : conversationActive
                  ? isUserSpeaking
                    ? 'Speak naturally - AI voice is paused'
                    : speaking && soundEnabled
                    ? 'AI is responding - please wait'
                    : !soundEnabled
                    ? 'Sound disabled - text responses only'
                    : 'Listening for your voice...'
                  : 'Click to start voice conversation'}
              </span>
            </div>

            {/* Connection Status */}
            <div className="text-center mt-2">
              <span
                className={`text-xs flex items-center justify-center space-x-1 ${
                  conversationActive ? 'text-green-500' : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    conversationActive ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                ></div>
                <span>
                  {conversationActive
                    ? 'Voice Chat Active'
                    : 'Voice Chat Inactive'}
                </span>
                {/* Sound status indicator */}
                <span className="mx-2">•</span>
                <span
                  className={soundEnabled ? 'text-green-500' : 'text-red-500'}
                >
                  {soundEnabled ? 'Sound On' : 'Sound Off'}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserDashboardHome
