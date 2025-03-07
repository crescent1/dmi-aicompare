<template>
  <v-row>
    <v-col 
      v-for="model in selectedModels" 
      :key="model.title"
      cols="12"
      md="6"
    >
      <v-card elevation="0" class="pa-4">
        <v-card-title>{{ model.title }}</v-card-title>
        <v-card-text>
          Response from {{ model.title }} will appear here
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
const { selectedModels } = storeToRefs(useCompareStore())
</script>