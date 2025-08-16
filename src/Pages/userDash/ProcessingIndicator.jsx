const ProcessingIndicator = () => (
  <div className="flex justify-start mb-4">
    <div className="bg-white text-gray-800 rounded-2xl rounded-bl-md px-4 py-3 shadow-lg border">
      <div className="flex items-center space-x-3">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: '0.1s' }}
          ></div>
          <div
            className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
            style={{ animationDelay: '0.2s' }}
          ></div>
        </div>
        <p className="text-sm text-gray-600">AI is thinking...</p>
      </div>
    </div>
  </div>
)

export default ProcessingIndicator
