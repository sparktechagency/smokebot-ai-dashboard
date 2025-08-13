import {
  AlertCircle,
  MessageSquare,
  Mic,
  Smartphone,
  Volume2,
  Waves,
} from 'lucide-react'
import Navbar from './Navbar'
import ChatContainer from './ChatContainer'
import FeaturesPanel from './FeaturesPanel'
import VoiceStatusIndicator from './VoiceStatusIndicator'
import VoiceControlPanel from './VoiceControlPanel'
import UseVoiceChat from './UseVoiceChat'

const mockFeatures = [
  { _id: '1', name: 'Premium Cigarettes', price: 12.99 },
  { _id: '2', name: 'Vaping Devices', price: 45.0 },
  { _id: '3', name: 'Smoking Accessories', price: 8.5 },
  { _id: '4', name: 'Lighters Collection', price: 15.25 },
  { _id: '5', name: 'Rolling Papers', price: 3.99 },
]

const VoiceChatbotDashboard = () => {
  const {
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
  } = UseVoiceChat()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <div className="container mx-auto px-4 py-6">
        {!('SpeechRecognition' in window) &&
          !('webkitSpeechRecognition' in window) && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="flex items-center space-x-2">
                <AlertCircle className="text-yellow-600" size={20} />
                <div>
                  <p className="text-yellow-800 font-medium">
                    Browser Compatibility Notice
                  </p>
                  <p className="text-yellow-700 text-sm mt-1">
                    Speech recognition is not supported in this browser. Please
                    use Chrome, Edge, or Safari for the best voice experience.
                  </p>
                </div>
              </div>
            </div>
          )}

        {isMobile && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center space-x-2">
              <Smartphone className="text-blue-600" size={20} />
              <div>
                <p className="text-blue-800 font-medium">Mobile Voice Chat</p>
                <p className="text-blue-700 text-sm mt-1">
                  For better voice recognition on mobile, use the Push to Talk
                  button and speak clearly after the beep.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="lg:col-span-3 order-2 lg:order-1">
            <ChatContainer
              chatHistory={chatHistory}
              isProcessing={isProcessing}
              userMessage={userMessage}
              isUserSpeaking={isUserSpeaking}
            />
          </div>

          <div className="lg:col-span-1 order-1 lg:order-2">
            <FeaturesPanel features={mockFeatures} />
          </div>
        </div>

        <div className="mb-6">
          <VoiceStatusIndicator
            isListening={isListening}
            isUserSpeaking={isUserSpeaking}
            speaking={speaking}
            conversationActive={conversationActive}
            soundEnabled={soundEnabled}
            noiseLevel={noiseLevel}
            isMobile={isMobile}
          />
        </div>

        <VoiceControlPanel
          conversationActive={conversationActive}
          soundEnabled={soundEnabled}
          isProcessing={isProcessing}
          isListening={isListening}
          speaking={speaking}
          onToggleConversation={toggleConversation}
          onToggleSound={toggleSound}
          onStartListening={startRecognition}
          onStopListening={stopRecognition}
          isMobile={isMobile}
        />

        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-4 px-4 py-2 bg-white rounded-full shadow-sm border">
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  conversationActive
                    ? 'bg-green-500 animate-pulse'
                    : 'bg-gray-400'
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  conversationActive ? 'text-green-600' : 'text-gray-500'
                }`}
              >
                Voice Chat {conversationActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="w-px h-4 bg-gray-300" />

            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  soundEnabled ? 'bg-blue-500' : 'bg-red-500'
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  soundEnabled ? 'text-blue-600' : 'text-red-600'
                }`}
              >
                Sound {soundEnabled ? 'On' : 'Off'}
              </span>
            </div>

            {isMobile && (
              <>
                <div className="w-px h-4 bg-gray-300" />
                <div className="flex items-center space-x-2">
                  <Smartphone size={14} className="text-purple-600" />
                  <span className="text-sm font-medium text-purple-600">
                    Mobile Mode
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-lg border p-6">
          <div className="flex items-center space-x-2 mb-4">
            <MessageSquare className="text-blue-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-800">
              How to Use Voice Chat
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Mic className="text-blue-600" size={16} />
                <span className="font-medium text-blue-800">
                  Step 1: Activate
                </span>
              </div>
              <p className="text-sm text-blue-700">
                Click the microphone button to start voice chat.
                {isMobile
                  ? ' Use "Push to Talk" for better control on mobile.'
                  : ' It will listen continuously.'}
              </p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <Waves className="text-green-600" size={16} />
                <span className="font-medium text-green-800">
                  Step 2: Speak
                </span>
              </div>
              <p className="text-sm text-green-700">
                Speak clearly and include keywords like smoke, product, bot, or
                help in your questions.
              </p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-2 mb-2">
                <Volume2 className="text-purple-600" size={16} />
                <span className="font-medium text-purple-800">
                  Step 3: Listen
                </span>
              </div>
              <p className="text-sm text-purple-700">
                The AI will respond with voice and text. Toggle sound on/off
                using the speaker button.
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Tip:</strong> For best results, speak in a quiet
              environment and wait for the AI to finish speaking before asking
              your next question.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VoiceChatbotDashboard
