<template>
  <v-app>
    <div class="d-flex flex-column flex-grow-1">
      <AppHeader />
      <v-main>
        <v-container
          fluid
          class="fill-height"
        >
          <NuxtPage />
        </v-container>
      </v-main>
    </div>
    <AppFooter />
  </v-app>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | DMI aicompare` : 'DMI aicompare'
  }
})
</script>
  
  
  