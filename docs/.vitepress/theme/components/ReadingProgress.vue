<template>
  <div class="reading-progress" :style="{ width: progress + '%' }" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const progress = ref(0)

function updateProgress() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop
  const scrollHeight = document.documentElement.scrollHeight
  const clientHeight = document.documentElement.clientHeight
  if (scrollHeight - clientHeight <= 0) {
    progress.value = 0
    return
  }
  const scrolled = scrollTop / (scrollHeight - clientHeight)
  progress.value = Math.min(Math.max(scrolled * 100, 0), 100)
}

function onRouteChanged() {
  progress.value = 0
  setTimeout(updateProgress, 300)
}

onMounted(() => {
  window.addEventListener('scroll', updateProgress, { passive: true })
  // Listen for VitePress SPA route changes via custom event
  window.addEventListener('vitepress-route-changed', onRouteChanged)
  // Also listen for popstate as fallback
  window.addEventListener('popstate', onRouteChanged)
  updateProgress()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress)
  window.removeEventListener('vitepress-route-changed', onRouteChanged)
  window.removeEventListener('popstate', onRouteChanged)
})
</script>

<style scoped>
.reading-progress {
  position: fixed;
  top: var(--vp-nav-height, 56px);
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #E8713A, #F09060, #FCC8A8);
  z-index: 99;
  transition: width 0.15s ease-out;
  border-radius: 0 2px 2px 0;
  box-shadow: 0 0 8px rgba(232, 113, 58, 0.4);
}

:global(.dark) .reading-progress {
  background: linear-gradient(90deg, #F09060, #E8713A, #D4622E);
  box-shadow: 0 0 8px rgba(240, 144, 96, 0.4);
}
</style>