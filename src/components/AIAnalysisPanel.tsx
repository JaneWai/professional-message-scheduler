import React from 'react'
import { Brain, AlertTriangle, CheckCircle, Lightbulb, Heart, Users, ArrowRight, Shield, Ban, AlertCircle } from 'lucide-react'
import { AIAnalysis, AIIssue, AISuggestion } from '../services/aiAnalyzer'

interface AIAnalysisPanelProps {
  analysis: AIAnalysis | null
  isAnalyzing: boolean
  onApplySuggestion: (suggestion: AISuggestion) => void
  onApplyAllSuggestions: () => void
}

const AIAnalysisPanel: React.FC<AIAnalysisPanelProps> = ({
  analysis,
  isAnalyzing,
  onApplySuggestion,
  onApplyAllSuggestions
}) => {
  if (isAnalyzing) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <Brain className="w-4 h-4 text-purple-600 animate-pulse" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">AI Content Analysis</h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600">Analyzing message for workplace appropriateness...</span>
        </div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <Brain className="w-4 h-4 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">AI Content Analysis</h3>
        </div>
        <div className="text-center py-8">
          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">
            Type a message to get AI-powered analysis for respectful workplace communication
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Our AI filters inappropriate content and promotes mental health-supportive messaging
          </p>
        </div>
      </div>
    )
  }

  // Check if message is blocked
  const isBlocked = analysis.isBlocked || analysis.issues.some(issue => issue.flagged)

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getIssueIcon = (type: AIIssue['type']) => {
    switch (type) {
      case 'profanity': return <Ban className="w-4 h-4" />
      case 'harassment': return <AlertCircle className="w-4 h-4" />
      case 'discrimination': return <AlertCircle className="w-4 h-4" />
      case 'mental-health': return <Heart className="w-4 h-4" />
      case 'respect': return <Users className="w-4 h-4" />
      case 'tone': return <AlertTriangle className="w-4 h-4" />
      case 'urgency': return <AlertTriangle className="w-4 h-4" />
      case 'boundary': return <Heart className="w-4 h-4" />
      default: return <AlertTriangle className="w-4 h-4" />
    }
  }

  const getSeverityColor = (severity: AIIssue['severity']) => {
    switch (severity) {
      case 'critical': return 'text-red-700 bg-red-100 border-red-300'
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200'
    }
  }

  const getCategoryColor = (category: AISuggestion['category']) => {
    switch (category) {
      case 'profanity': return 'text-red-600'
      case 'mental-health': return 'text-green-600'
      case 'respect': return 'text-blue-600'
      case 'boundary': return 'text-purple-600'
      case 'professionalism': return 'text-indigo-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <Brain className="w-4 h-4 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">AI Content Analysis</h3>
        </div>
        {analysis.suggestions.length > 0 && !isBlocked && (
          <button
            onClick={onApplyAllSuggestions}
            className="text-sm bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Apply All
          </button>
        )}
      </div>

      {/* Blocked Message Warning */}
      {isBlocked && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Ban className="w-5 h-5 text-red-600" />
            <h4 className="text-lg font-semibold text-red-800">Message Blocked</h4>
          </div>
          <p className="text-red-700 text-sm">
            This message contains content that violates workplace communication standards and cannot be sent. 
            Please review the issues below and revise your message.
          </p>
        </div>
      )}

      {/* Enhanced Scores */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="text-center">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(analysis.score)}`}>
            {analysis.score}/100
          </div>
          <p className="text-xs text-gray-600 mt-1">Overall</p>
        </div>
        <div className="text-center">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(analysis.profanityScore)}`}>
            {analysis.profanityScore}/100
          </div>
          <p className="text-xs text-gray-600 mt-1">Professional</p>
        </div>
        <div className="text-center">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(analysis.respectScore)}`}>
            {analysis.respectScore}/100
          </div>
          <p className="text-xs text-gray-600 mt-1">Respect</p>
        </div>
        <div className="text-center">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(analysis.mentalHealthScore)}`}>
            {analysis.mentalHealthScore}/100
          </div>
          <p className="text-xs text-gray-600 mt-1">Mental Health</p>
        </div>
      </div>

      {/* Issues */}
      {analysis.issues.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2 text-yellow-600" />
            Issues Detected ({analysis.issues.length})
          </h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {analysis.issues.map((issue, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${getSeverityColor(issue.severity)} ${
                  issue.flagged ? 'ring-2 ring-red-300' : ''
                }`}
              >
                <div className="flex items-start space-x-2">
                  {getIssueIcon(issue.type)}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium capitalize">
                        {issue.type.replace('-', ' ')}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(issue.severity)}`}>
                        {issue.severity}
                      </span>
                      {issue.flagged && (
                        <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">
                          BLOCKED
                        </span>
                      )}
                    </div>
                    <p className="text-xs mt-1">{issue.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {analysis.suggestions.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <Lightbulb className="w-4 h-4 mr-2 text-blue-600" />
            AI Suggestions ({analysis.suggestions.length})
          </h4>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {analysis.suggestions.slice(0, 5).map((suggestion, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-xs font-medium uppercase tracking-wide ${getCategoryColor(suggestion.category)}`}>
                    {suggestion.category.replace('-', ' ')}
                  </span>
                  {!isBlocked && (
                    <button
                      onClick={() => onApplySuggestion(suggestion)}
                      className="text-xs bg-white text-purple-600 px-2 py-1 rounded border border-purple-200 hover:bg-purple-50 transition-colors"
                    >
                      Apply
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-700 mb-2">{suggestion.reason}</p>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-red-600 bg-red-50 px-2 py-1 rounded max-w-xs truncate">
                    "{suggestion.original}"
                  </span>
                  <ArrowRight className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  <span className="text-green-600 bg-green-50 px-2 py-1 rounded max-w-xs truncate">
                    "{suggestion.suggested}"
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success State */}
      {analysis.issues.length === 0 && analysis.suggestions.length === 0 && (
        <div className="text-center py-6">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Excellent Message!</h4>
          <p className="text-gray-600">
            Your message meets all workplace communication standards and promotes a healthy work environment.
          </p>
          <div className="mt-4 flex justify-center space-x-4 text-sm">
            <div className="flex items-center text-green-600">
              <Shield className="w-4 h-4 mr-1" />
              Professional
            </div>
            <div className="flex items-center text-blue-600">
              <Users className="w-4 h-4 mr-1" />
              Respectful
            </div>
            <div className="flex items-center text-purple-600">
              <Heart className="w-4 h-4 mr-1" />
              Supportive
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AIAnalysisPanel
