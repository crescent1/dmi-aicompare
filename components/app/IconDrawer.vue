<template>
  <v-app-bar-nav-icon
    v-tooltip:bottom="tooltipMessage"
    @click="toggleDrawer()"
  >
    <v-icon
      :icon="drawer ? 'mdi-arrow-left-drop-circle-outline' : 'mdi-arrow-right-drop-circle-outline'"
    />
  </v-app-bar-nav-icon>
</template>

<script lang="ts" setup>
const { toggleDrawer } = useAppLayoutStore()
const { tooltipMessage, drawer } = storeToRefs(useAppLayoutStore())
</script>
