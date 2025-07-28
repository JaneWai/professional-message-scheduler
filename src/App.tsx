import React, { useState, useEffect } from 'react'
import { Clock, MessageSquare, Mail, Plus, Calendar, Settings, Trash2, Edit3, Send, Table, Grid } from 'lucide-react'
import MessageForm from './components/MessageForm'
import MessageList from './components/MessageList'
import MessageTable from './components/MessageTable'
import Header from './components/Header'
import { Message, MessageType } from './types'

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingMessage, setEditingMessage] = useState<Message | null>(null)
  const [activeTab, setActiveTab] = useState<'scheduled' | 'sent'>('scheduled')
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table')

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
    setShowForm(false)
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Clock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Professional Message Scheduler
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Schedule WhatsApp and email messages to be sent during work hours, 
            respecting your colleagues' time and maintaining professional boundaries.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{scheduledMessages.length}</p>
                <p className="text-gray-600">Scheduled Messages</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Send className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{sentMessages.length}</p>
                <p className="text-gray-600">Messages Sent</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">7AM+</p>
                <p className="text-gray-600">Delivery Window</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center mb-8">
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5 mr-2" />
            Schedule New Message
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('scheduled')}
              className={`py-2 px-4 rounded-md font-medium transition-colors ${
                activeTab === 'scheduled'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Scheduled ({scheduledMessages.length})
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`py-2 px-4 rounded-md font-medium transition-colors ${
                activeTab === 'sent'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sent ({sentMessages.length})
            </button>
          </div>

          {/* View Toggle */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center py-2 px-3 rounded-md font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Table className="w-4 h-4 mr-1" />
              Table
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`flex items-center py-2 px-3 rounded-md font-medium transition-colors ${
                viewMode === 'cards'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid className="w-4 h-4 mr-1" />
              Cards
            </button>
          </div>
        </div>

        {/* Message Display */}
        {viewMode === 'table' ? (
          <MessageTable
            messages={activeTab === 'scheduled' ? scheduledMessages : sentMessages}
            onEdit={handleEdit}
            onDelete={deleteMessage}
            onMarkAsSent={markAsSent}
            showActions={activeTab === 'scheduled'}
          />
        ) : (
          <MessageList
            messages={activeTab === 'scheduled' ? scheduledMessages : sentMessages}
            onEdit={handleEdit}
            onDelete={deleteMessage}
            onMarkAsSent={markAsSent}
            showActions={activeTab === 'scheduled'}
          />
        )}

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
