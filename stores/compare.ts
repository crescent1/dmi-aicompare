import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCompareStore = defineStore('compare', () => {
  const chromeApiStore = useChromeApiStore()
  const { setLocalData, getLocalData } = chromeApiStore
  const selectedModels = ref<string[]>([])
  const systemPrompt = ref<string>('')
  const isLoading = ref(false)
  
  const aiModels = ref([
    {
      title: "Chat GPT 03 Mini",
      model: "03-mini",
      disabled: false,
    },
    {
      title: "Chat GPT 4.0",
      model: "gpt-4",
      disabled: false,
    },
    {
      title: "Claude 3.7",
      model: "claude-3-7",
      disabled: false,
    },
    {
      title: "Deepseek V3",
      model: "deepseek-v3",
      disabled: false,
    },
    {
      title: "Deepseek R1",
      model: "deepseek-r1",
      disabled: false,
    },
    {
      title: "Gemini 2.0 Flash",
      model: "gemini-2-flash",
      disabled: false,
    },
    {
      title: "Grok 2",
      model: "grok-2",
      disabled: false,
    },
    {
      title: "Qwen 2.5 Max",
      model: "qwen-2-5-max",
      disabled: false,
    }
  ])

  onMounted(() => {
    const models = getLocalData(chromeApiStore.storageKeys.selected_models)
    const promptText = getLocalData(chromeApiStore.storageKeys.system_prompt)
    selectedModels.value = models ? models : []
    systemPrompt.value = promptText ? promptText : ''
  })

  const saveModels = async () => {
    
    try {
      
      isLoading.value = true
      setLocalData(chromeApiStore.storageKeys.selected_models, selectedModels.value)
      setLocalData(chromeApiStore.storageKeys.system_prompt, systemPrompt.value)
      
    } catch (error) {
      console.error('Comparison failed:', error)
    } finally {
      isLoading.value = false
      navigateTo('/compare')
    }
  }

  const updateModels = async () => {
    // isLoading.value = true
    // try {
    //   // Your comparison logic here
    //   console.log('Comparing models:', selectedModels.value)
    //   console.log('With prompt:', systemPrompt.value)
      
    //   // Example async operation
    //   await new Promise(resolve => setTimeout(resolve, 1000))
      
    //   // Navigate to results or handle response
    //   navigateTo('/results')
    // } catch (error) {
    //   console.error('Comparison failed:', error)
    // } finally {
    //   isLoading.value = false
    // }
    console.log(selectedModels.value);
  }

  return {
    selectedModels,
    systemPrompt,
    aiModels,
    isLoading,
    saveModels,
    updateModels
  }
})