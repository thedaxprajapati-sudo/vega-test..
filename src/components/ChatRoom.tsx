import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

interface Message {
  id: string
  content: string
  username: string
  user_id: string
  created_at: string
}

export function ChatRoom() {
  const { user, signOut } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const username = user?.user_metadata?.username ?? user?.email ?? 'Unknown'

  useEffect(() => {
    loadMessages()

    const channel = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages((prev) => [...prev, payload.new as Message])
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(100)

    if (error) {
      console.error('Failed to load messages:', error.message)
    } else {
      setMessages(data ?? [])
    }
    setLoading(false)
  }

  const handleSend = async (e: FormEvent) => {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed || sending) return

    setSending(true)
    setInput('')

    const { error } = await supabase.from('messages').insert({
      content: trimmed,
      username,
    })

    if (error) {
      setInput(trimmed)
      console.error('Failed to send:', error.message)
    }
    setSending(false)
  }

  const formatTime = (iso: string) => {
    const date = new Date(iso)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="chat-container">
      <header className="chat-header">
        <div className="chat-header-left">
          <div className="chat-logo">CL</div>
          <div>
            <h2>ChatLoop</h2>
            <span className="chat-status">
              <span className="status-dot"></span> {messages.length} messages
            </span>
          </div>
        </div>
        <div className="chat-header-right">
          <span className="user-badge">Hi, {username}</span>
          <button onClick={signOut} className="signout-btn">Sign Out</button>
        </div>
      </header>

      <div className="chat-messages">
        {loading ? (
          <div className="chat-empty">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="chat-empty">
            <p>No messages yet.</p>
            <p className="chat-empty-sub">Be the first to say something!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.user_id === user?.id
            return (
              <div key={msg.id} className={`message ${isOwn ? 'own' : ''}`}>
                <div className="message-avatar">
                  {msg.username.charAt(0).toUpperCase()}
                </div>
                <div className="message-body">
                  <div className="message-meta">
                    <span className="message-author">{msg.username}</span>
                    <span className="message-time">{formatTime(msg.created_at)}</span>
                  </div>
                  <div className="message-content">{msg.content}</div>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="chat-input-bar">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={sending}
          autoFocus
        />
        <button type="submit" disabled={sending || !input.trim()} className="send-btn">
          Send
        </button>
      </form>
    </div>
  )
}
