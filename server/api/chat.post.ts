import { streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { createDeepSeek } from '@ai-sdk/deepseek'
import { createAnthropic } from '@ai-sdk/anthropic'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import type { AIProvider, ChatRequestBody, Message } from '~/types'
import { RuntimeConfig } from 'nuxt/schema'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody<ChatRequestBody>(event)

  const { 
    content, 
    messages, 
    model,
    systemprompt 
  } = body

  const defaultSystemPrompt = config.public.systemprompt
  const aiProvider = getAIProvider(provider, apikey, config)
  const finalSystemPrompt = `${systemprompt} Analyze the conversation history to provide contextually relevant responses. Build upon previous exchanges to deliver comprehensive and connected answers. Your name is AiCompare`

  return handleConversation(aiProvider, model, finalSystemPrompt, messages, content)
})

function handleSingleMessage(aiProvider: any, model: string, systemPrompt: string, content: string) {
  return streamText({
    model: aiProvider(model),
    system: systemPrompt,
    prompt: content,
    onError: handleStreamError
  }).toDataStreamResponse()
}

function handleConversation(aiProvider: any, model: string, systemPrompt: string, messages: Message[], content: string) {
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

function handleStreamError({ error }: { error: unknown }) {
  throw createError({
    statusCode: 500,
    message: error instanceof Error ? error.message : 'Streaming error'
  })
}

const getConfigKey = (provider, config): string => {
  switch (provider) {
    case 'openai':
      return config.openai.apikey
    case 'deepseekr1':
    case 'deepseekv3':
      return config.deepseek.apikey
    case 'openrouterdeepseekr1':
      return config.openrouter.deepseekapikey
    case 'anthropicclaudesonnet':
      return config.anthropic.apikey
    default:
      return ''
  }
}

const AI_PROVIDERS = {
  openai: (apiKey: string) => createOpenAI({ apiKey }),
  deepseekr1: (apiKey: string) => createDeepSeek({ apiKey }),
  deepseekv3: (apiKey: string) => createDeepSeek({ apiKey }),
  openrouterdeepseekr1: (apiKey: string) => {
    const router = createOpenRouter({ apiKey })
    return () => router('deepseek/deepseek-r1')
  },
  anthropicclaudesonnet: (apiKey: string) => createAnthropic({ apiKey })
} as const

export function getAIProvider(provider, apiKey: string, config: RuntimeConfig) {
  const providerConfig = AI_PROVIDERS[provider as keyof typeof AI_PROVIDERS]
  
  if (!providerConfig) {
    throw createError({
      statusCode: 400,
      message: `Unsupported AI provider: ${provider}`
    })
  }

  const resolvedApiKey = apiKey || getConfigKey(provider, config)
  return providerConfig(resolvedApiKey)
}