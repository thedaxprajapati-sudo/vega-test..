import { AuthProvider, useAuth } from './context/AuthContext'
import { AuthScreen } from './components/AuthScreen'
import { ChatRoom } from './components/ChatRoom'

function AppContent() {
  const auth = useAuth()
  const session = auth?.session
  const loading = auth?.loading ?? false

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
