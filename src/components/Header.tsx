import React from 'react'
import { Clock, MessageSquare, Mail, Zap } from 'lucide-react'

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">ScheduleSync</h1>
              <p className="text-sm text-gray-600">Professional Message Scheduling</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-gray-600">
              <MessageSquare className="w-4 h-4" />
              <span className="text-sm font-medium">Respectful Communication</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Work-Life Balance</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
