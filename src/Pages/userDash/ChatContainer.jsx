import { MessageSquare } from 'lucide-react'
import ChatMessage from './ChatMessage'
import ProcessingIndicator from './ProcessingIndicator'
import { useEffect, useRef } from 'react'

const ChatContainer = ({
  chatHistory,
  isProcessing,
  userMessage,
  isUserSpeaking,
}) => {
  const chatContainerRef = useRef(null)

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatHistory])

  return (
    <div className="bg-white rounded-xl shadow-lg border h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-xl">
        <div className="flex items-center space-x-2">
          <MessageSquare className="text-blue-600" size={20} />
          <h2 className="text-lg font-semibold text-gray-800">Conversation</h2>
        </div>
      </div>

      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white"
        style={{ minHeight: '400px', maxHeight: 'calc(100vh - 400px)' }}
      >
        {chatHistory.length === 0 ? (
          <div className="flex items-center justify-center text-gray-400 h-full">
            <div className="text-center max-w-md">
              <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">
                Start Your Conversation
              </p>
              <p className="text-sm">
                Speak commands containing keywords like <strong>smoke</strong>,
                <strong>product</strong>,<strong>bot</strong>, or{' '}
                <strong>help</strong> to get assistance.
              </p>
            </div>
          </div>
        ) : (
          <>
            {chatHistory.map((message, index) => (
              <ChatMessage
                key={index}
                message={message}
                isUser={message.role === 'user'}
              />
            ))}

            {isProcessing && <ProcessingIndicator />}

            {isUserSpeaking && userMessage && (
              <div className="flex justify-end mb-4">
                <div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-2xl rounded-br-md px-4 py-3 max-w-[80%] sm:max-w-md shadow-lg opacity-70">
                  <p className="text-sm">{userMessage}</p>
                  <div className="flex items-center space-x-1 mt-2">
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
  )
}

export default ChatContainer