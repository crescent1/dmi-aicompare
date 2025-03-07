<template>
  <v-form @submit.prevent="onSubmit" class="form-container">
    <div class="chat-input-wrapper">
      <div class="chat-input-container">
        <v-textarea
          v-model="userInput"
          :placeholder="computedPlaceholder"
          row-height="25"
          rows="3"
          variant="outlined"
          auto-grow
          hide-details
          class="chat-textarea"
          @keydown="handleKeydown"
        />
        <v-btn
          icon="mdi-send"
          size="small"
          :disabled="!isValidInput"
          class="send-button gradient-btn"
          type="submit"
          @click.stop
        />
      </div>
      <div v-if="validationMessage" class="validation-message">
        {{ validationMessage }}
      </div>
    </div>
  </v-form>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useDisplay } from 'vuetify'

const display = useDisplay()
const userInput = ref('')
const validationMessage = ref('')

const isValidInput = computed(() => userInput.value.trim().length >= 2)
const computedPlaceholder = computed(() => {
  return display.mobile.value 
    ? 'Tulis Kata' 
    : 'Tulis Kata (Tekan Enter untuk mengirim)'
})

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    if (e.shiftKey) {
      validationMessage.value = ''
      return
    }

    e.preventDefault()
    if (!isValidInput.value) {
      validationMessage.value = 'Pesan minimal 2 huruf.'
      return
    }

    validationMessage.value = ''
    onSubmit(e)
  }
}

const onSubmit = (event: Event) => {
  if (isValidInput.value) {
    handleSubmit()
    const target = event.target as HTMLElement
    target.blur()
    validationMessage.value = ''
  }
}

const handleSubmit = () => {

}
</script>

<style scoped>
.form-container {
  width: 100%;
}

.chat-input-wrapper {
  width: 100%;
  padding: 0 16px;
}

.chat-input-container {
  position: relative;
  width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 28px;
  background: white;
  box-shadow: 0 0 10px rgba(0,0,0,0.05);
}

.chat-textarea {
  padding-right: 48px !important;
}

.chat-textarea :deep(.v-field__outline) {
  display: none;
}

.send-button {
  position: absolute;
  bottom: 8px;
  right: 8px;
  z-index: 1;
}

/* Dark mode support */
:deep(.v-theme--dark) .chat-input-container {
  background: #2d2d2d;
  border-color: #404040;
}


.validation-message {
  color: #ff5252;
  font-size: 12px;
  margin-top: 4px;
  padding-left: 16px;
}

.gradient-btn {
  background: linear-gradient(to right, #9C27B0, #673AB7) !important;
  color: white !important;
}

@media (max-width: 600px) {
  .chat-input-wrapper {
    padding: 0 8px;
  }
}
</style>