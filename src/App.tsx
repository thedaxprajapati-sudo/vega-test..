import { AuthProvider, useAuth } from './context/AuthContext'
import { AuthScreen } from './components/AuthScreen'
import { ChatRoom } from './components/ChatRoom'

function AppContent() {
  const { session, loading } = useAuth() || {}

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return session ? <ChatRoom /> : <AuthScreen />
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
