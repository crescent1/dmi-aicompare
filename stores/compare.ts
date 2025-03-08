import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid';
import { getUnixTime } from 'date-fns';
import type { Message, SanitizedMessages } from '~/types'
import { markdownService } from '~/services/markdown';

interface SelectedModel {
  model: string
  title: string
  disable: boolean
  loading: boolean
  messages: Message[]
}

export const useCompareStore = defineStore('compare', () => {
  const chromeApiStore = useChromeApiStore()
  const { setLocalData, getLocalData } = chromeApiStore
  const { renderMarkdown } = markdownService()
  const selectedModels = ref<SelectedModel[]>([])
  const systemPrompt = ref<string>('')
  const isLoading = ref(false)
  const userInput = ref<string>('')
  const aiModels = ref([
    {
      title: "Chat GPT 03 Mini",
      model: "03-mini",
      disabled: false,
      loading: false,
      messages: [],
    },
    {
      title: "Chat GPT 4.0",
      model: "gpt-4o",
      disabled: false,
      loading: false,
      messages: [],
    },
    {
      title: "Claude 3.7",
      model: "claude-3-7-sonnet-latest",
      disabled: false,
      loading: false,
      messages: [],
    },
    {
      title: "Deepseek V3",
      model: "deepseek-chat",
      disabled: false,
      loading: false,
      messages: [],
    },
    {
      title: "Deepseek R1",
      model: "deepseek-reasoner",
      disabled: false,
      loading: false,
      messages: [],
    },
    {
      title: "Gemini 2.0 Flash",
      model: "gemini-2.0-flash",
      disabled: false,
      loading: false,
      messages: [],
    },
    {
      title: "Grok 2",
      model: "x-ai/grok-2-1212",
      disabled: false,
      loading: false,
      messages: [],
    },
    {
      title: "Qwen 2.5 Max",
      model: "qwen/qwen-max",
      disabled: false,
      loading: false,
      messages: [],
    }
  ])

  const messages = ref<SelectedModel[]>([])
  const updatedMessages = computed<SelectedModel[]>(() => messages.value)

  onMounted(() => {
    const models = getLocalData(chromeApiStore.storageKeys.selected_models)
    const promptText = getLocalData(chromeApiStore.storageKeys.system_prompt)
    selectedModels.value = models ? models : []
    systemPrompt.value = promptText ? promptText : ''
    messages.value = models ? models : []
  })

  const saveModels = async () => {
    try {
      
      isLoading.value = true
      setLocalData(chromeApiStore.storageKeys.selected_models, selectedModels.value)
      setLocalData(chromeApiStore.storageKeys.system_prompt, systemPrompt.value)
      messages.value = selectedModels.value
      
    } catch (error) {
      console.error('Comparison failed:', error)
    } finally {
      isLoading.value = false
      navigateTo('/compare')
    }
  }

  const updateModels = async () => {
    try {
      
      isLoading.value = true
      setLocalData(chromeApiStore.storageKeys.selected_models, selectedModels.value)
      setLocalData(chromeApiStore.storageKeys.system_prompt, systemPrompt.value)
      messages.value = selectedModels.value
      
    } catch (error) {
      console.error('Comparison failed:', error)
    } finally {
      isLoading.value = false
      // navigateTo('/compare')
    }
  }

  const updateSelectedModels = async () => {
    setLocalData(chromeApiStore.storageKeys.selected_models, selectedModels.value)
    messages.value = selectedModels.value
  }

  const handleSubmit = async () => {
    messages.value = messages.value.map(model => ({
      ...model,
      loading: true,
      messages: [
        ...model.messages,
        {
          message_id: uuidv4(),
          role: chromeApiStore.roles.user,
          content: userInput.value,
          content_raw: userInput.value
        },
        {
          message_id: uuidv4(),
          role: chromeApiStore.roles.assistant,
          content: '',
          content_raw: ''
        }
      ]
    }))

    // Process each model's request
  const processStreams = messages.value.map(async (model, index) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: userInput.value,
          messages: model.messages,
          model: model.model,
          systemprompt: systemPrompt.value
        })
      })

      if (!response.ok) throw new Error('Network response ERROR')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      let isFirstChunk = true
      let hasValidContent = false
      let currentContent = ''

      const updateModelContent = () => {
        messages.value = messages.value.map((m, i) => {
          if (i === index) {
            const lastMessageIndex = m.messages.length - 1
            return {
              ...m,
              messages: m.messages.map((msg, msgIndex) => 
                msgIndex === lastMessageIndex ? {
                  ...msg,
                  content: renderMarkdown(currentContent),
                  content_raw: currentContent
                } : msg
              )
            }
          }
          return m
        })
      }

      while (reader) {
        const { done, value } = await reader.read()
        if (done) {
          messages.value = messages.value.map((m, i) => 
            i === index ? { ...m, loading: false } : m
          )
          break
        }

        const text = decoder.decode(value)
        const chunks = text.split('\n').filter(Boolean)

        for (const chunk of chunks) {
          if (chunk.startsWith('3:')) {
            messages.value = messages.value.map((m, i) => 
              i === index ? {
                ...m,
                loading: false,
                messages: m.messages.map((msg, msgIndex) => 
                  msgIndex === m.messages.length - 1 ? {
                    ...msg,
                    content: renderMarkdown("Sistem butuh istirahat sejenak nih! ⚡"),
                    content_raw: "Sistem butuh istirahat sejenak nih! ⚡"
                  } : msg
                )
              } : m
            )
            return
          }

          if (chunk.startsWith('0:')) {
            if (isFirstChunk) {
              isFirstChunk = false
            }

            const content = chunk
              .slice(2)
              .replace(/^"|"$/g, '')
              .replace(/\\n/g, '\n')

            if (content) {
              hasValidContent = true
              currentContent += content
              updateModelContent()
            }
          } else if (chunk.includes('"finishReason":"unknown"') && !hasValidContent) {
            messages.value = messages.value.map((m, i) => 
              i === index ? {
                ...m,
                loading: false,
                messages: m.messages.map((msg, msgIndex) => 
                  msgIndex === m.messages.length - 1 ? {
                    ...msg,
                    content: renderMarkdown("Sistem perlu penyegaran sebentar! ⚡"),
                    content_raw: "Sistem perlu penyegaran sebentar! ⚡"
                  } : msg
                )
              } : m
            )
            return
          }
        }
      }
    } catch (error) {
      console.error(`Error processing model ${model.title}:`, error)
      messages.value = messages.value.map((m, i) => 
        i === index ? { ...m, loading: false } : m
      )
    }
  })

  await Promise.all(processStreams)
  
    userInput.value = '' // Clear input after sending
    console.log(userInput.value);
    console.log(messages.value)
  }

  return {
    selectedModels,
    systemPrompt,
    aiModels,
    isLoading,
    userInput,
    updatedMessages,
    saveModels,
    updateModels,
    updateSelectedModels,
    handleSubmit
  }
})