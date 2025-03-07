<template>
  <v-app>
    <div class="d-flex flex-column flex-grow-1 bg-grey-lighten-5">
      <AppHeader />
      <v-main>
        <v-container
          fluid
          class="pa-3"
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
  
  
  