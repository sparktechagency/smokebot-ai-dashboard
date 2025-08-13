import Navbar from './Navbar'
import ChatMessage from './ChatMessage'
import ProcessingIndicator from './ProcessingIndicator'
import VoiceStatusIndicator from './VoiceStatusIndicator'
import FeaturesPanel from './FeaturesPanel'
import ChatContainer from './ChatContainer'

const UserDashboardMain = () => {
  return (
    <div>
      <Navbar />
      <ChatMessage />
      <ProcessingIndicator />
      <VoiceStatusIndicator />
      <ChatContainer />
      <FeaturesPanel />
    </div>
  )
}

export default UserDashboardMain
