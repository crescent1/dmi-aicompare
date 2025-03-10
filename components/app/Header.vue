<template>
  <v-app-bar
    elevation="0"
    density="compact"
    height="85"
    class="ga-3 pl-1"
  >
    <AppIconDrawer />
    <NuxtLink to="/" class="text-decoration-none pl-8">
      <div class="d-flex align-center">
        <span class="title-text font-weight-bold gradient-text">
          DMI <span class="gradient-text-secondary">aicompare</span>
        </span>
      </div>
    </NuxtLink>
  </v-app-bar>
</template>

<script lang="ts" setup>
</script>

<style scoped>
.title-text {
  font-size: 2rem;
}

@media (max-width: 600px) {
  .title-text {
    font-size: 1.5rem;
  }
  
  .pl-8 {
    padding-left: 1rem !important;
  }
}

.gradient-text {
  background: linear-gradient(to right, #2196F3, #1976D2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: all 0.3s ease;
}

.gradient-text-secondary {
  background: linear-gradient(to right, #9C27B0, #673AB7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: all 0.3s ease;
}

.title-text:hover {
  transform: scale(1.02);
}
</style>