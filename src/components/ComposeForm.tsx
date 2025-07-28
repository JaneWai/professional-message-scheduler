import React, { useState, useEffect } from 'react'
import { MessageSquare, Mail, User, Calendar, Clock, Send, AlertTriangle } from 'lucide-react'
import { Message, MessageType } from '../types'
import { aiAnalyzer, AIAnalysis, AISuggestion } from '../services/aiAnalyzer'
import AIAnalysisPanel from './AIAnalysisPanel'

interface ComposeFormProps {
  onSubmit: (message: Omit<Message, 'id' | 'createdAt' | 'status'>) => void
}

const ComposeForm: React.FC<ComposeFormProps> = ({ onSubmit }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<MessageType>('email')
  const [recipient, setRecipient] = useState('')
  const [message, setMessage] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('09:00')
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Set default date to tomorrow
  useEffect(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setScheduledDate(tomorrow.toISOString().split('T')[0])
  }, [])

  // Analyze message when content changes
  useEffect(() => {
    if (message.trim().length > 5) {
      setIsAnalyzing(true)
      // Simulate API delay for more realistic experience
      const timer = setTimeout(() => {
        const result = aiAnalyzer.analyzeMessage(message, scheduledTime)
        setAnalysis(result)
        setIsAnalyzing(false)
      }, 800)

      return () => clearTimeout(timer)
    } else {
      setAnalysis(null)
      setIsAnalyzing(false)
    }
  }, [message, scheduledTime])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check if message is blocked by AI
    if (analysis && aiAnalyzer.isMessageBlocked(analysis)) {
      alert('Message cannot be sent due to inappropriate content. Please review the AI analysis and revise your message.')
      return
    }
    
    onSubmit({
      type: selectedPlatform,
      recipient,
      content: message,
      scheduledDate: new Date(scheduledDate),
      scheduledTime,
      timezone: 'UTC'
    })

    // Reset form
    setRecipient('')
    setMessage('')
    setAnalysis(null)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setScheduledDate(tomorrow.toISOString().split('T')[0])
    setScheduledTime('09:00')
  }

  const handleApplySuggestion = (suggestion: AISuggestion) => {
    if (suggestion.type === 'rewrite') {
      const newMessage = message.replace(
        new RegExp(suggestion.original, 'gi'),
        suggestion.suggested
      )
      setMessage(newMessage)
    } else if (suggestion.type === 'addition') {
      setMessage(suggestion.suggested)
    } else if (suggestion.type === 'tone-adjustment') {
      setMessage(suggestion.suggested)
    } else if (suggestion.type === 'complete-rewrite') {
      setMessage(suggestion.suggested)
    }
  }

  const handleApplyAllSuggestions = () => {
    if (analysis) {
      const improvedMessage = aiAnalyzer.generateImprovedMessage(message, analysis.suggestions)
      setMessage(improvedMessage)
    }
  }

  const platforms = [
    { id: 'whatsapp', name: 'WhatsApp', icon: MessageSquare, color: 'bg-green-600', available: true },
    { id: 'email', name: 'Email', icon: Mail, color: 'bg-red-500', available: true }
  ]

  // Check if message is blocked
  const isMessageBlocked = analysis && aiAnalyzer.isMessageBlocked(analysis)

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Compose Message</h2>
          <p className="text-gray-600">Schedule your message with AI-powered workplace communication analysis</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Platform Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Select Platform
            </label>
            <div className="grid grid-cols-2 gap-3">
              {platforms.map((platform) => {
                const Icon = platform.icon
                const isSelected = selectedPlatform === platform.id
                
                return (
                  <button
                    key={platform.id}
                    type="button"
                    onClick={() => setSelectedPlatform(platform.id as MessageType)}
                    className={`relative flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${platform.color}`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {platform.name}
                    </span>
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Recipient */}
          <div>
            <label htmlFor="recipient" className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 mr-2" />
              Recipient
            </label>
            <input
              type="text"
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g., person@company.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent resize-none ${
                isMessageBlocked 
                  ? 'border-red-300 focus:ring-red-500 bg-red-50' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              required
            />
            <div className="mt-2 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  {message.length}/500 characters
                </div>
                {isMessageBlocked && (
                  <div className="flex items-center text-red-600 text-sm">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    Message blocked
                  </div>
                )}
              </div>
              {analysis && (
                <div className="flex items-center space-x-2">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    analysis.score >= 80 ? 'bg-green-100 text-green-700' :
                    analysis.score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    AI Score: {analysis.score}/100
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 mr-2" />
                Date
              </label>
              <input
                type="date"
                id="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label htmlFor="time" className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 mr-2" />
                Time
              </label>
              <select
                id="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="07:00">7:00 AM</option>
                <option value="08:00">8:00 AM</option>
                <option value="09:00">9:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="13:00">1:00 PM</option>
                <option value="14:00">2:00 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="16:00">4:00 PM</option>
                <option value="17:00">5:00 PM</option>
                <option value="18:00">6:00 PM</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isMessageBlocked}
            className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
              isMessageBlocked
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
            }`}
          >
            <Send className="w-5 h-5" />
            <span>{isMessageBlocked ? 'Message Blocked' : 'Schedule Message'}</span>
          </button>
          
          {isMessageBlocked && (
            <p className="text-sm text-red-600 text-center">
              Please review and fix the issues identified by our AI before sending.
            </p>
          )}
        </form>
      </div>

      {/* AI Analysis Panel */}
      <AIAnalysisPanel
        analysis={analysis}
        isAnalyzing={isAnalyzing}
        onApplySuggestion={handleApplySuggestion}
        onApplyAllSuggestions={handleApplyAllSuggestions}
      />
    </div>
  )
}

export default ComposeForm
