<template>
  <v-row class="chat-messages-container">
    <v-col 
      v-for="model in updatedMessages" 
      :key="model.title"
      cols="12"
      md="6"
      class="g-1"
    >
      <v-card elevation="0" class="m-0 chat-messages">
        <v-card-title>{{ model.title }}</v-card-title>
        <v-card-text>
          <div>
            <div
              v-for="(message, index) in model.messages"
              :key="index"
              class=""
            >
              <!-- User Message -->
              <v-row
                v-if="message.role === 'user'"
                class="align-start"
              >
                <v-col
                  cols="12"
                  class="d-flex"
                >
                  <div class="flex-grow-1">
                    <v-alert
                      variant="tonal"
                      border="start"
                      color="purple-darken-1"
                      class="rounded-lg mb-0"
                    >
                      {{ message.content }}
                    </v-alert>
                  </div>
                </v-col>
              </v-row>

              <!-- Assistant Message -->
              <v-row
                v-else
                class="align-start"
              >
                <v-col
                  cols="12"
                  class="d-flex"
                >
                  <div class="flex-grow-1">
                    <div
                      v-if="message.content"
                      class="rounded-lg mb-0 px-2 py-0 message-content"
                      v-html="message.content"
                    />
                    <LoadingList v-if="model.loading && index === model.messages.length - 1" />
                  </div>
                </v-col>
              </v-row>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
const { selectedModels, updatedMessages } = storeToRefs(useCompareStore())
</script>

<style scoped>
.sticky-top {
  position: sticky;
  top: 0;
}

.message-content {
  font-family: 'Roboto', sans-serif;
}

.message-content :deep(ul),
.message-content :deep(ol) {
  padding-left: 24px;
  margin-bottom: 16px;
}

.message-content :deep(li) {
  margin-bottom: 8px;
}

.message-content :deep(pre) {
  margin: 16px 0;
  border-radius: 8px;
}

.message-content :deep(code) {
  font-family: 'Roboto Mono', monospace;
}

.message-content :deep(blockquote) {
  border-left: 4px solid var(--v-primary-base);
  margin: 16px 0;
  padding: 8px 16px;
  background-color: rgb(var(--v-theme-surface-variant));
}

.message-content :deep(.markdown-link) {
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
}

.message-content :deep(.markdown-link:hover) {
  text-decoration: underline;
}

/* Animation for new content */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.message-content {
  animation: fadeIn 0.3s ease-in;
}

.message-content :deep(h1) {
  font-size: 1.5rem !important;
  margin-top: 1.5rem !important;
  margin-bottom: 1rem !important;
}

.message-content :deep(h2) {
  font-size: 1.3rem !important;
  margin-top: 1.25rem !important;
  margin-bottom: 0.875rem !important;
}

.message-content :deep(h3) {
  font-size: 1.1rem !important;
  margin-top: 1rem !important;
  margin-bottom: 0.75rem !important;
}

.message-content :deep(h4) {
  font-size: 1rem !important;
  margin-top: 0.875rem !important;
  margin-bottom: 0.625rem !important;
}

.message-content :deep(.markdown-link) {
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
  position: relative;
  padding-right: 1.2em;
  transition: color 0.2s ease;
}

.message-content :deep(.markdown-link::after) {
  content: '↗';
  position: absolute;
  right: 0;
  top: -0.1em;
  font-size: 0.9em;
  opacity: 0.7;
}

.message-content :deep(.markdown-link:hover) {
  color: rgb(var(--v-theme-secondary));
}

.message-content :deep(.markdown-link:hover::after) {
  opacity: 1;
}

/* .chat-container {
  position: relative;
  height: calc(100vh - 125px);
  overflow-y: auto;
} */

.chat-messages-container {
  margin-bottom: 100px;
}

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

.chat-form-container.drawer-open {
  left: 250px; /* Width of your sidebar */
}

.chat-form-wrapper {
  max-width: 768px;
  margin: 0 auto;
  transition: all 0.3s ease;
}

@media (max-width: 600px) {
  .chat-form-container {
    padding: 12px 16px;
    left: 0 !important;
  }
}
</style>