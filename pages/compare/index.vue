<template>
  <v-row>
    <v-col cols="12" class="mx-auto">
      <AppCompareSetting :setting-from="'compare'" />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'default'
})
useHead({
  title: 'Compare'
})
</script>