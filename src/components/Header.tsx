import React from 'react'
import { MessageSquare, Mail, Clock } from 'lucide-react'

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">MessageScheduler</h1>
              <p className="text-sm text-gray-600">Professional timing for your messages</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-gray-600">
              <MessageSquare className="w-5 h-5" />
              <span className="text-sm font-medium">WhatsApp</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Mail className="w-5 h-5" />
              <span className="text-sm font-medium">Email</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
