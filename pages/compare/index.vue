<template>
  <v-row class="ma-0">
    <v-col cols="12" class="pa-0">
      <div class="px-0">
        <!-- Settings Panel -->
        <v-expansion-panels elevation="0" class="mb-4">
          <v-expansion-panel>
            <v-expansion-panel-title>
              <div class="d-flex align-center">
                <v-icon icon="mdi-cog" class="mr-2" />
                AI Comparison Settings
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <AppCompareSetting :setting-from="'compare'" />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <!-- Result Cards -->
        <AppChatResult class="chat-messages-container" />

        <div class="chat-form-container">
          <div class="chat-form-wrapper">
            <AppChatForm />
          </div>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
const { updateSelectedModels } = useCompareStore()
const { selectedModels } = storeToRefs(useCompareStore())

watch(selectedModels, () => {
  updateSelectedModels()
})
definePageMeta({
  layout: 'default'
})
useHead({
  title: 'Compare'
})
</script>

<style scoped>
.chat-form-container {
  position: fixed;
  bottom: 30px; /* Height of your footer */
  left: 0;
  right: 0;
  padding: 16px 24px;
  background: linear-gradient(to bottom, transparent, rgb(var(--v-theme-background)) 20%);
  z-index: 99;
  transition: left 0.2s ease;
}

.chat-form-wrapper {
  max-width: 768px;
  margin: 0 auto;
  transition: all 0.3s ease;
}

.chat-messages-container {
  margin-bottom: 100px;
}

@media (max-width: 600px) {
  .chat-form-container {
    padding: 12px 16px;
    left: 0 !important;
  }
}
</style>