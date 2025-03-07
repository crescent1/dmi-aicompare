<template>
  <v-row class="mt-0">
    <v-col cols="12" class="pt-0">
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
      <v-row>
        <v-col 
          v-for="model in selectedModels" 
          :key="model"
          cols="12"
          md="6"
        >
          <v-card elevation="0" class="pa-4">
            <v-card-title>{{ model }}</v-card-title>
            <v-card-text>
              Response from {{ model }} will appear here
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
const { selectedModels } = storeToRefs(useCompareStore())

definePageMeta({
  layout: 'default'
})
useHead({
  title: 'Compare'
})
</script>