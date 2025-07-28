import React from 'react'
import { MessageSquare, Mail, Clock, Edit3, Trash2, Send, Calendar } from 'lucide-react'
import { Message } from '../types'

interface MessageListProps {
  messages: Message[]
  onEdit: (message: Message) => void
  onDelete: (id: string) => void
  onMarkAsSent: (id: string) => void
  showActions: boolean
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  onEdit, 
  onDelete, 
  onMarkAsSent, 
  showActions 
}) => {
  if (messages.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {showActions ? 'No scheduled messages' : 'No sent messages'}
        </h3>
        <p className="text-gray-600">
          {showActions 
            ? 'Schedule your first message to get started'
            : 'Sent messages will appear here'
          }
        </p>
      </div>
    )
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Header */}
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  message.type === 'whatsapp' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  {message.type === 'whatsapp' ? (
                    <MessageSquare className="w-5 h-5" />
                  ) : (
                    <Mail className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">
                      {message.type === 'whatsapp' ? 'WhatsApp' : 'Email'}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">{message.recipient}</span>
                  </div>
                  {message.subject && (
                    <p className="text-sm text-gray-600 mt-1">
                      Subject: {message.subject}
                    </p>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="mb-4">
                <p className="text-gray-800 leading-relaxed">
                  {message.content}
                </p>
              </div>

              {/* Scheduling Info */}
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(message.scheduledDate)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(message.scheduledTime)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>{message.timezone}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            {showActions && (
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => onEdit(message)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit message"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onMarkAsSent(message.id)}
                  className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Mark as sent"
                >
                  <Send className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(message.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Status Badge */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              message.status === 'scheduled'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
            }`}>
              {message.status === 'scheduled' ? 'Scheduled' : 'Sent'}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MessageList
