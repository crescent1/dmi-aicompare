<template>
  <v-card elevation="0" class="pa-6 rounded-lg">
    <div class="d-flex justify-space-between align-center mb-6">
      <v-card-title class="text-h5 pa-0">
        Settings
      </v-card-title>
      <v-chip
        :color="selectedModels.length < 2 ? 'warning' : selectedModels.length > 6 ? 'error' : 'primary'"
        size="small"
        variant="elevated"
      >
        <v-icon start icon="mdi-check-circle" size="small"></v-icon>
        {{ selectedModels.length }}/6 models
      </v-chip>
    </div>
    
    <v-form @submit.prevent="handleSubmit">
      <div class="mb-6">
        <div class="d-flex align-center justify-space-between mb-4">
          <div class="d-flex align-center">
            <v-icon 
              icon="mdi-robot-industrial" 
              color="primary" 
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
            <v-checkbox
              v-model="selectedModels"
              :label="model.title"
              :value="model"
              :disabled="model.disabled || (selectedModels.length >= 6 && !selectedModels.includes(model.model))"
              color="primary"
              density="comfortable"
              hide-details
            />
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

      <v-btn
        color="primary"
        size="large"
        block
        :loading="isLoading"
        :disabled="selectedModels.length < 2 || selectedModels.length > 6 || !systemPrompt"
        class="text-none"
        elevation="2"
        type="submit"
      >
        {{ settingFrom === 'home' ? 'Save Setting' : 'Update Setting' }}
        <v-icon icon="mdi-content-save" class="ml-2"></v-icon>
      </v-btn>
    </v-form>
  </v-card>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useCompareStore } from '~/stores/compare'

const compareStore = useCompareStore()
const { selectedModels, systemPrompt, aiModels, isLoading } = storeToRefs(compareStore)
const { saveModels, updateModels } = compareStore

const props = defineProps({
  settingFrom: {
    type: String,
    required: true
  }
})

const handleSubmit = async () => {
  if (props.settingFrom === 'home') {
    await saveModels()
  } else {
    await updateModels()
  }
}
</script>

<style scoped>
.v-textarea :deep(.v-field__input) {
  min-height: 50px !important;
}
</style>