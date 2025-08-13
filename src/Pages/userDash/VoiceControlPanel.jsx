import {
  Loader,
  Mic,
  MicOff,
  PlayCircle,
  StopCircle,
  Volume2,
  VolumeX,
} from 'lucide-react'

const VoiceControlPanel = ({
  conversationActive,
  soundEnabled,
  isProcessing,
  isListening,
  speaking,
  onToggleConversation,
  onToggleSound,
  onStartListening,
  onStopListening,
  isMobile,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border">
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
        {/* Main Voice Toggle Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={onToggleConversation}
            disabled={isProcessing}
            className={`p-6 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 ${
              conversationActive
                ? 'bg-gradient-to-r from-red-500 to-red-600 focus:ring-red-200'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 focus:ring-blue-200'
            } text-white ${
              isProcessing ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-xl'
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
          <span className="text-sm font-medium mt-2 text-gray-600">
            {conversationActive ? 'Stop Voice Chat' : 'Start Voice Chat'}
          </span>
        </div>

        {/* Manual Listen Button for Mobile */}
        {isMobile && conversationActive && (
          <div className="flex flex-col items-center">
            <button
              onClick={isListening ? onStopListening : onStartListening}
              disabled={isProcessing || speaking}
              className={`p-4 rounded-full shadow-lg transition-all duration-200 ${
                isListening
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                  : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
              } ${
                isProcessing || speaking
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:shadow-lg'
              }`}
            >
              {isListening ? (
                <StopCircle size={24} />
              ) : (
                <PlayCircle size={24} />
              )}
            </button>
            <span className="text-xs font-medium mt-2 text-gray-600">
              {isListening ? 'Stop Listening' : 'Push to Talk'}
            </span>
          </div>
        )}

        {/* Sound Toggle Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={onToggleSound}
            className={`p-4 rounded-full shadow-lg transition-all duration-200 ${
              soundEnabled
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
            } hover:shadow-lg`}
          >
            {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </button>
          <span className="text-xs font-medium mt-2 text-gray-600">
            {soundEnabled ? 'Sound On' : 'Sound Off'}
          </span>
        </div>
      </div>

      {/* Status Text */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600 max-w-md mx-auto">
          {isProcessing
            ? 'Processing your message...'
            : conversationActive
            ? isListening
              ? isMobile
                ? 'Tap "Push to Talk" and speak clearly'
                : 'Speak naturally - say keywords like "smoke", "product", or "help"'
              : speaking && soundEnabled
              ? 'AI is responding - please wait'
              : !soundEnabled
              ? 'Sound disabled - text responses only'
              : 'Ready to listen for voice commands'
            : 'Click the microphone to start voice conversation'}
        </p>
      </div>
    </div>
  )
}

export default VoiceControlPanel
