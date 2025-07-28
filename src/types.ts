export type MessageType = 'whatsapp' | 'email'

export interface Message {
  id: string
  type: MessageType
  recipient: string
  subject?: string // Only for email
  content: string
  scheduledDate: Date
  scheduledTime: string
  timezone: string
  status: 'scheduled' | 'sent'
  createdAt: Date
}
