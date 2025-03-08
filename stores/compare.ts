import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid';
import { getUnixTime } from 'date-fns';
import type { Message } from '~/types'

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
      model: "gpt-4",
      disabled: false,
      loading: false,
      messages: [],
    },
    {
      title: "Claude 3.7",
      model: "claude-3-7",
      disabled: false,
      loading: false,
      messages: [],
    },
    {
      title: "Deepseek V3",
      model: "deepseek-v3",
      disabled: false,
      loading: false,
      messages: [],
    },
    {
      title: "Deepseek R1",
      model: "deepseek-r1",
      disabled: false,
      loading: false,
      messages: [],
    },
    {
      title: "Gemini 2.0 Flash",
      model: "gemini-2-flash",
      disabled: false,
      loading: false,
      messages: [],
    },
    {
      title: "Grok 2",
      model: "grok-2",
      disabled: false,
      loading: false,
      messages: [],
    },
    {
      title: "Qwen 2.5 Max",
      model: "qwen-2-5-max",
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