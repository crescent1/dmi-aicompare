<template>
  <v-row>
    <v-col cols="12" md="10" lg="8" class="mx-auto">
      <AppCompareSetting :setting-from="'home'" />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: 'default'
})
useHead({
  title: 'Home'
})
</script>