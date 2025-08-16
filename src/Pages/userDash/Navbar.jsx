import { useState, useEffect } from 'react'
import { Power } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const [timeLeft, setTimeLeft] = useState(300)
  const Navigate = useNavigate()

  useEffect(() => {
    if (timeLeft <= 0) {
      Navigate(-1)
      localStorage.removeItem('phoneNumber')
      localStorage.removeItem('user-id')
      return
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft, Navigate])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const handleEndSession = () => {
    Navigate(-1)
    localStorage.removeItem('phoneNumber')
    localStorage.removeItem('user-id')
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-white">
            <span className="text-yellow-300">SmokeBot</span> Chatbot
          </div>

          <div className="hidden sm:flex bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
            <div>
              <div className="text-xs text-white/80">Session Time</div>
              <div className="text-lg font-semibold text-white text-center">
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>

          <button
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
            onClick={handleEndSession}
          >
            <span className="hidden sm:inline">End Session</span>
            <Power size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Navbar
