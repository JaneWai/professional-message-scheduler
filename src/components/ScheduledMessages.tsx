import React from 'react'
import { MessageSquare, Mail, Clock, Edit3, Trash2, Send, CheckCircle } from 'lucide-react'
import { Message } from '../types'

interface ScheduledMessagesProps {
  scheduledMessages: Message[]
  sentMessages: Message[]
  onEdit: (message: Message) => void
  onDelete: (id: string) => void
  onMarkAsSent: (id: string) => void
}

const ScheduledMessages: React.FC<ScheduledMessagesProps> = ({
  scheduledMessages,
  sentMessages,
  onEdit,
  onDelete,
  onMarkAsSent
}) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
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

  const formatCreatedDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    }) + ', ' + new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
  }

  const allMessages = [...scheduledMessages, ...sentMessages].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Scheduled Messages</h2>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">{scheduledMessages.length} scheduled</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-600">{sentMessages.length} sent</span>
          </div>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {allMessages.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No messages scheduled yet</p>
          </div>
        ) : (
          allMessages.map((message) => (
            <div
              key={message.id}
              className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    message.type === 'whatsapp' 
                      ? 'bg-green-100 text-green-600' 
                      : message.type === 'email'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-blue-100 text-blue-600'
                  }`}>
                    {message.type === 'whatsapp' ? (
                      <MessageSquare className="w-4 h-4" />
                    ) : (
                      <Mail className="w-4 h-4" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        message.status === 'scheduled'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {message.status === 'scheduled' ? (
                          <>
                            <Clock className="w-3 h-3 mr-1" />
                            Scheduled
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Sent
                          </>
                        )}
                      </span>
                    </div>
                    
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      To: {message.recipient}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      {truncateText(message.content, 80)}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        Scheduled: {formatDate(message.scheduledDate)}, {formatTime(message.scheduledTime)}
                      </span>
                      <span>
                        Created: {formatCreatedDate(message.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {message.status === 'scheduled' && (
                  <div className="flex items-center space-x-1 ml-2">
                    <button
                      onClick={() => onEdit(message)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit message"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(message.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ScheduledMessages
