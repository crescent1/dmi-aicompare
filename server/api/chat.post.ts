import { streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { createDeepSeek } from '@ai-sdk/deepseek'
import { createAnthropic } from '@ai-sdk/anthropic'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { v4 as uuidv4 } from 'uuid'
import type { Message as VercelMessage } from 'ai'
import type { AIProvider, ChatRequestBody, Message } from '~/types'
import { RuntimeConfig } from 'nuxt/schema'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody<ChatRequestBody>(event)
  const { content, messages, model, systemprompt } = body
  const finalSystemPrompt = `${systemprompt} Analyze the conversation history to provide contextually relevant responses. Build upon previous exchanges to deliver comprehensive and connected answers.`

  // Determine provider and API key based on model
  let provider: AIProvider
  let apiKey: string

  switch (model) {
    case 'qwen/qwen-max':
    case 'x-ai/grok-2-1212':
      provider = 'openrouter'
      apiKey = config.openrouter.apikey
      break
    
    case 'gpt-4o':
    case 'gpt-4o-mini':
    case '03-mini':
      provider = 'openai'
      apiKey = config.openai.apikey
      break
    
    case 'deepseek-chat':
    case 'deepseek-reasoner':
      provider = 'deepseek'
      apiKey = config.deepseek.apikey
      break
    
    case 'claude-3-5-sonnet-latest':
      provider = 'anthropic'
      apiKey = config.anthropic.apikey
    case 'claude-3-7-sonnet-latest':
      provider = 'anthropic'
      apiKey = config.anthropic.apikey
      break
    
    case 'gemini-2.0-flash':
    case 'gemini-2.0-flash-001':
      provider = 'google'
      apiKey = config.gemini.apikey
      break
    
    default:
      throw createError({
        statusCode: 400,
        message: `Unsupported model: ${model}`
      })
  }

  const aiProvider = getAIProvider(provider, apiKey)
  return handleConversation(aiProvider, model, finalSystemPrompt, messages, content)
})

const AI_PROVIDERS = {
  openai: (apiKey: string) => createOpenAI({ apiKey }),
  deepseek: (apiKey: string) => createDeepSeek({ 
    apiKey,
    baseURL: 'https://api.deepseek.com'
  }),
  anthropic: (apiKey: string) => createAnthropic({ 
    apiKey,
    baseURL: 'https://api.anthropic.com/v1',
  }),
  google: (apiKey: string) => createGoogleGenerativeAI({ apiKey }),
  openrouter: (apiKey: string) => {
    const router = createOpenRouter({ apiKey })
    return (model: string) => router(model) // Return a function that takes the model parameter
  }
} as const

function getAIProvider(provider: string, apiKey: string) {
  const providerConfig = AI_PROVIDERS[provider as keyof typeof AI_PROVIDERS]
  
  if (!providerConfig) {
    throw createError({
      statusCode: 400,
      message: `Unsupported AI provider: ${provider}`
    })
  }

  return providerConfig(apiKey)
}

function handleConversationOld(aiProvider: any, model: string, systemPrompt: string, messages: Message[], content: string) {
  const transformedMessages = messages
    .map(msg => ({
      role: msg.role as "system" | "user" | "assistant",
      content: msg.content_raw.substring(0, 500)
    }))
    .slice(-4)

  return streamText({
    model: aiProvider(model),
    messages: [
      { role: 'system', content: systemPrompt },
      ...transformedMessages,
      { role: 'user', content }
    ],
    onError: handleStreamError
  }).toDataStreamResponse()
}

function handleConversation(aiProvider: any, model: string, systemPrompt: string, messages: Message[], content: string) {
  const transformedMessages: VercelMessage[] = messages
    .map(msg => ({
      id: uuidv4(),
      role: msg.role as 'system' | 'user' | 'assistant',
      content: msg.content_raw ? msg.content_raw : 'hi'
    }))
    .slice(-4)

  const payload = {
    model: aiProvider(model),
    messages: [
      { role: 'system' as const, content: systemPrompt },
      ...transformedMessages,
      { role: 'user' as const, content }
    ],
    temperature: 0.7,
    stream: true,
    onError: handleStreamError
  }

  return streamText(payload).toDataStreamResponse()
}

function handleStreamErrorOld({ error }: { error: unknown }) {
  throw createError({
    statusCode: 500,
    message: error instanceof Error ? error.message : 'Streaming error'
  })
}

function handleStreamError({ error }: { error: unknown }) {
  console.error('Stream error details:', error)
  throw createError({
    statusCode: 500,
    message: error instanceof Error ? error.message : 'Streaming error',
    cause: error
  })
}