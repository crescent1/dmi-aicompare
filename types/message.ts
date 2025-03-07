export interface Message {
  message_id: string
  role: string
  content: string
  content_raw: string
}

export interface SanitizedMessages {
  message_id: string
  role: string
  content_raw: string
}