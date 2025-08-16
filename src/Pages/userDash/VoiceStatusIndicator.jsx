import { Smartphone, Volume2, VolumeX, Waves } from 'lucide-react'

const VoiceStatusIndicator = ({
  isListening,
  isUserSpeaking,
  speaking,
  conversationActive,
  soundEnabled,
  noiseLevel,
  isMobile,
}) => {
  const getStatus = () => {
    if (isUserSpeaking)
      return {
        text: 'You are speaking...',
        color: 'text-red-500',
        bg: 'bg-red-100',
      }
    if (speaking)
      return {
        text: 'AI is responding...',
        color: 'text-green-500',
        bg: 'bg-green-100',
      }
    if (isListening)
      return {
        text: 'Listening for your voice...',
        color: 'text-blue-500',
        bg: 'bg-blue-100',
      }
    if (conversationActive)
      return {
        text: 'Ready to listen',
        color: 'text-gray-600',
        bg: 'bg-gray-100',
      }
    return {
      text: 'Voice chat inactive',
      color: 'text-gray-400',
      bg: 'bg-gray-50',
    }
  }

  const status = getStatus()

  return (
    <div className={`p-4 rounded-xl border-2 ${status.bg} border-gray-200`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div
            className={`w-4 h-4 rounded-full ${
              isUserSpeaking
                ? 'bg-red-500 animate-pulse'
                : speaking
                ? 'bg-green-500 animate-pulse'
                : isListening
                ? 'bg-blue-500 animate-pulse'
                : 'bg-gray-300'
            }`}
          />
          <span className={`font-medium ${status.color}`}>{status.text}</span>
          {isMobile && <Smartphone size={16} className="text-gray-400" />}
        </div>
      </div>
    </div>
  )
}
export default VoiceStatusIndicator
