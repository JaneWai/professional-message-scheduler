import React, { useState, useEffect } from 'react'
import { Clock, MessageSquare, Mail, Plus, Calendar, Settings, Trash2, Edit3, Send, Table, Grid, User, Zap } from 'lucide-react'
import MessageForm from './components/MessageForm'
import MessageList from './components/MessageList'
import MessageTable from './components/MessageTable'
import Header from './components/Header'
import ComposeForm from './components/ComposeForm'
import ScheduledMessages from './components/ScheduledMessages'
import { Message, MessageType } from './types'

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'whatsapp',
      recipient: '#general',
      content: 'Good morning team! Hope everyone has a great day ahead.',
      scheduledDate: new Date('2024-01-15'),
      scheduledTime: '09:00',
      timezone: 'UTC',
      status: 'scheduled',
      createdAt: new Date('2024-01-14T16:30:00')
    },
    {
      id: '2',
      type: 'email',
      recipient: 'Sarah Johnson',
      subject: 'Project Timeline Sync',
      content: 'Hi Sarah, could we schedule a quick sync about the project timeline?',
      scheduledDate: new Date('2024-01-15'),
      scheduledTime: '10:30',
      timezone: 'UTC',
      status: 'scheduled',
      createdAt: new Date('2024-01-14T18:45:00')
    },
    {
      id: '3',
      type: 'whatsapp',
      recipient: 'Marketing Team',
      content: 'The campaign assets are ready for review. Please check the shared folder and let me know your thoughts.',
      scheduledDate: new Date('2024-01-14'),
      scheduledTime: '09:00',
      timezone: 'UTC',
      status: 'sent',
      createdAt: new Date('2024-01-13T17:20:00')
    }
  ])
  const [showForm, setShowForm] = useState(false)
  const [editingMessage, setEditingMessage] = useState<Message | null>(null)

  // Load messages from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('scheduledMessages')
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    }
  }, [])

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem('scheduledMessages', JSON.stringify(messages))
  }, [messages])

  const addMessage = (messageData: Omit<Message, 'id' | 'createdAt' | 'status'>) => {
    const newMessage: Message = {
      ...messageData,
      id: Date.now().toString(),
      createdAt: new Date(),
      status: 'scheduled'
    }
    setMessages(prev => [...prev, newMessage])
  }

  const updateMessage = (updatedMessage: Message) => {
    setMessages(prev => prev.map(msg => 
      msg.id === updatedMessage.id ? updatedMessage : msg
    ))
    setEditingMessage(null)
    setShowForm(false)
  }

  const deleteMessage = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id))
  }

  const markAsSent = (id: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, status: 'sent' as const } : msg
    ))
  }

  const handleEdit = (message: Message) => {
    setEditingMessage(message)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingMessage(null)
  }

  const scheduledMessages = messages.filter(msg => msg.status === 'scheduled')
  const sentMessages = messages.filter(msg => msg.status === 'sent')

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Compose Form with AI Analysis */}
          <div className="space-y-6">
            <ComposeForm onSubmit={addMessage} />
          </div>

          {/* Right Column - Scheduled Messages */}
          <div className="space-y-6">
            <ScheduledMessages 
              scheduledMessages={scheduledMessages}
              sentMessages={sentMessages}
              onEdit={handleEdit}
              onDelete={deleteMessage}
              onMarkAsSent={markAsSent}
            />
          </div>
        </div>

        {/* Message Form Modal */}
        {showForm && (
          <MessageForm
            onSubmit={editingMessage ? updateMessage : addMessage}
            onClose={handleCloseForm}
            initialData={editingMessage}
          />
        )}
      </main>
    </div>
  )
}

export default App
