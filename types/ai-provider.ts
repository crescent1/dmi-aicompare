import type { Message } from "~/types"
import type { OpenAIProvider } from '@ai-sdk/openai'
import type { DeepSeekProvider } from '@ai-sdk/deepseek'
import type { OpenRouterLanguageModel } from '@openrouter/ai-sdk-provider'
import type { AnthropicProvider } from '@ai-sdk/anthropic'

export type AIProvider = 
  'openai' |
  'openrouterdeepseekr1' |
  'anthropicclaudesonnet' |
  'deepseek' |
  'google' |
  'openrouter'

export type ProviderResponse = 
  | OpenAIProvider 
  | DeepSeekProvider 
  | AnthropicProvider 
  | (() => OpenRouterLanguageModel)

export interface ChatRequestBody {
  content: string
  messages: Message[]
  isnextchat: boolean
  provider: AIProvider
  model: string
  apikey: string
  systemprompt: string
}
