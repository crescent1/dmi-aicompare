<template>
  <v-row>
    <v-col cols="12" md="8" class="mx-auto">
      <v-card elevation="2" class="pa-6 rounded-lg">
        <v-card-title class="text-h5 mb-6 d-flex align-center">
          Compare AI Models
          <v-chip
            class="ml-4"
            color="primary"
            size="small"
          >
            {{ selectedModels.length }} selected
          </v-chip>
        </v-card-title>
        
        <v-form>
          <div class="mb-6">
            <div class="d-flex align-center mb-4">
              <v-icon icon="mdi-robot" color="primary" class="mr-2"></v-icon>
              <span class="text-subtitle-1 font-weight-medium">Select AI Models to Compare</span>
            </div>
            <v-row>
              <v-col 
                v-for="model in aiModels" 
                :key="model" 
                cols="12" 
                sm="6" 
                md="4"
              >
              <v-checkbox
                v-model="selectedModels"
                :label="model.title"
                :value="model.model"
                :disabled="model.disabled"
                color="primary"
                density="comfortable"
                hide-details
              ></v-checkbox>
              </v-col>
            </v-row>
          </div>

          <div class="mb-6">
            <div class="d-flex align-center mb-4">
              <v-icon icon="mdi-text" color="primary" class="mr-2"></v-icon>
              <span class="text-subtitle-1 font-weight-medium">System Prompt</span>
            </div>
            <v-textarea
              v-model="systemPrompt"
              placeholder="Enter your system prompt here..."
              variant="outlined"
              rows="6"
              auto-grow
              hide-details
              class="rounded-lg bg-grey-lighten-4"
            ></v-textarea>
          </div>

          <v-btn
            color="primary"
            size="large"
            block
            :disabled="!selectedModels.length || !systemPrompt"
            class="text-none"
          >
            Compare Models
            <v-icon icon="mdi-arrow-right" class="ml-2"></v-icon>
          </v-btn>
        </v-form>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useCompareStore } from '~/stores/compare'

const { selectedModels, systemPrompt, aiModels } = storeToRefs(useCompareStore())


definePageMeta({
  layout: 'default'
})
useHead({
  title: 'Home'
})
</script>

<style scoped>
.v-card {
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.v-textarea :deep(.v-field__input) {
  min-height: 150px !important;
}
</style>