<template>
  <v-row>
    <v-col cols="12">
      <v-card elevation="2" class="pa-4">
        <v-card-title class="text-h5 mb-4">Compare AI Models</v-card-title>
        
        <v-form>
          <div class="mb-4">
            <div class="text-subtitle-1 mb-2">Select AI Models to Compare</div>
            <v-checkbox
              v-for="model in aiModels"
              :key="model"
              v-model="selectedModels"
              :label="model"
              :value="model"
              color="primary"
            ></v-checkbox>
          </div>

          <v-textarea
            v-model="systemPrompt"
            label="System Prompt"
            variant="outlined"
            rows="4"
            auto-grow
          ></v-textarea>
        </v-form>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
const selectedModels = ref<string[]>([])
const systemPrompt = ref('')

const aiModels = [
  '03 mini',
  'Gpt 4.0',
  'Claude 3.7',
  'Deepsek V3, R1',
  'Gemini 2.0 Flash',
  'Grok 2',
  'qwen 2.5 max'
]


definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Home'
})
</script>