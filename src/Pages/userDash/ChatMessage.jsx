const ChatMessage = ({ message, isUser }) => (
  <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
    <div
      className={`max-w-[80%] sm:max-w-md px-4 py-3 rounded-2xl ${
        isUser
          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md shadow-lg'
          : 'bg-white text-gray-800 rounded-bl-md shadow-lg border'
      }`}
    >
      <p className="text-sm leading-relaxed">{message.content}</p>
      <span
        className={`text-xs block mt-2 ${
          isUser ? 'text-blue-100' : 'text-gray-500'
        }`}
      >
        {new Date(message.timestamp).toLocaleTimeString()}
      </span>
    </div>
  </div>
)

export default ChatMessage
