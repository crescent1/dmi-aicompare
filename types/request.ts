import type { AIProvider } from "./ai-provider"
import type { SanitizedMessages } from "./message"

export interface SecurePayload {
    content: string
    messages: SanitizedMessages[]
    isnextchat: boolean
    provider: AIProvider
    model: string
    apikey: string
    systemprompt: string
  }