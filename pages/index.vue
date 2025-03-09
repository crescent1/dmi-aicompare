<template>
  <v-row class="ma-0">
    <v-col cols="12" class="pa-0">
      <div class="px-0">
        <!-- Settings Panel -->
        <AppCompareSetting :setting-from="'home'" />

        <!-- Result Cards -->
        <AppChatResult class="chat-messages-container" />

        <div v-if="selectedModels.length > 1" class="chat-form-container">
          <div class="chat-form-wrapper">
            <AppChatForm />
          </div>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
const { selectedModels } = storeToRefs(useCompareStore())

definePageMeta({
  layout: 'default'
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