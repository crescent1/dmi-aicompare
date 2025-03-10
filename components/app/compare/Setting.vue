<template>
  <v-expansion-panels v-model="panelState" elevation="0" class="mb-4">
    <v-expansion-panel>
      <v-expansion-panel-title>
        <div class="d-flex align-center text-blue-darken-2">
          <v-icon icon="mdi-cog" class="mr-2" />
          Settings
        </div>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-card elevation="0" class="px-4">
          <div class="d-flex justify-space-between align-center mb-6">
            <div class="d-flex align-center gap-4">
              <v-chip
                :color="selectedModels.length < 2 ? 'warning' : selectedModels.length > 6 ? 'error' : 'blue-darken-2'"
                size="small"
                variant="elevated"
              >
                <v-icon start icon="mdi-check-circle" size="small"></v-icon>
                {{ selectedModels.length }}/6 models
              </v-chip>
            </div>
          </div>
          
          <v-form @submit.prevent="handleSubmit">
            <div class="mb-6">
              <div class="d-flex align-center justify-space-between mb-4">
                <div class="d-flex align-center">
                  <v-icon 
                    icon="mdi-robot-industrial" 
                    color="blue-darken-2" 
                    class="mr-2"
                    size="20"
                  ></v-icon>
                  <span class="text-subtitle-1 font-weight-medium">AI Models Selection</span>
                </div>
                <v-chip
                  color="grey-lighten-1"
                  size="small"
                  variant="flat"
                >
                  Max 6 models
                </v-chip>
              </div>
              <v-row>
                <v-col 
                  v-for="model in aiModels" 
                  :key="model.title" 
                  cols="12" 
                  sm="6" 
                  md="3"
                  class="py-0"
                >
                  <v-hover v-slot="{ isHovering, props: hoverProps }">
                    <v-checkbox
                      v-bind="hoverProps"
                      v-model="selectedModels"
                      :label="model.title"
                      :value="model"
                      :disabled="model.disabled || (selectedModels.length >= 6 && !selectedModels.some(m => m.model === model.model))"
                      color="blue-darken-2"
                      density="comfortable"
                      hide-details
                      :class="{ 'elevation-3': isHovering }"
                      class="transition-ease-in-out rounded-lg pa-2"
                    />
                  </v-hover>
                </v-col>
              </v-row>
            </div>

            <div class="mb-6">
              <div class="d-flex align-center mb-4">
                <v-icon 
                  icon="mdi-message-text" 
                  color="primary" 
                  class="mr-2"
                  size="20"
                ></v-icon>
                <span class="text-subtitle-1 font-weight-medium">Enter Your Prompt</span>
              </div>
              <v-textarea
                v-model="systemPrompt"
                placeholder="Type your prompt here to compare AI models responses..."
                variant="outlined"
                rows="3"
                auto-grow
                hide-details
                class="rounded-lg bg-grey-lighten-4"
              ></v-textarea>
            </div>

            <div class="d-flex mb-2">
              <v-btn
                color="error"
                variant="text"
                size="large"
                prepend-icon="mdi-delete"
                @click="clearData"
                :disabled="!selectedModels.length && !systemPrompt"
                class="text-none flex-grow-0 mr-2"
                elevation="0"
                type="button"
              >
                Clear Data
              </v-btn>

              <v-btn
                color="blue-darken-2"
                size="large"
                :loading="isLoading"
                :disabled="selectedModels.length < 2 || selectedModels.length > 6 || !systemPrompt"
                class="text-none flex-grow-1"
                elevation="0"
                type="submit"
              >
                Save
                <v-icon icon="mdi-content-save" class="ml-2"></v-icon>
              </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
  
  <v-snackbar
    v-model="snackbar.show"
    :color="snackbar.color"
    :timeout="3000"
  >
    {{ snackbar.text }}
  </v-snackbar>
</template>

<script lang="ts" setup>
import type { Message } from '~/types'

const panelState = ref([1]) // Keep panel open by default
const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})

const compareStore = useCompareStore()
const chromeStore = useChromeApiStore()
const { selectedModels, systemPrompt, aiModels, isLoading } = storeToRefs(compareStore)
const { saveModels, updateSelectedModels } = compareStore
const { removeLocalData } = chromeStore

const showNotification = (text: string, color = 'success') => {
  snackbar.value = {
    show: true,
    text,
    color
  }
}

const clearData = () => {
  selectedModels.value = []
  systemPrompt.value = ''

  removeLocalData(chromeStore.storageKeys.selected_models)
  removeLocalData(chromeStore.storageKeys.system_prompt)
  showNotification('Data cleared successfully', 'info')
}

const handleSubmit = async () => {
  await saveModels()
  showNotification('Settings saved successfully')
}

interface ModelType {
  title: string
  model: string
  disabled: boolean
  loading: boolean
  messages: Message[]
}

const handleModelSelection = (checked: boolean | null, model: ModelType) => {
  if (checked === true) {
    selectedModels.value.push(model)
  } else if (checked === false) {
    selectedModels.value = selectedModels.value.filter(m => m.model !== model.model)
  }
}

watch(selectedModels, async () => {
  updateSelectedModels().then(() => {
    // showNotification('Settings saved successfully')
  })
})
</script>

<style scoped>
.v-textarea :deep(.v-field__input) {
  min-height: 50px !important;
}

.transition-ease-in-out {
  transition: all 0.3s ease-in-out;
}
</style>