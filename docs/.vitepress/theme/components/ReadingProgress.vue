<template>
  <div class="reading-progress" :style="{ width: progress + '%' }" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
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

// Reset progress on route change
watch(() => route.path, () => {
  progress.value = 0
  // Delay update since page content may still be rendering
  setTimeout(updateProgress, 200)
})

onMounted(() => {
  window.addEventListener('scroll', updateProgress, { passive: true })
  updateProgress()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress)
})
</script>

<style scoped>
.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #E8713A, #F09060, #FCC8A8);
  z-index: 9998;
  transition: width 0.15s ease-out;
  border-radius: 0 2px 2px 0;
  box-shadow: 0 0 8px rgba(232, 113, 58, 0.4);
}

:global(.dark) .reading-progress {
  background: linear-gradient(90deg, #F09060, #E8713A, #D4622E);
  box-shadow: 0 0 8px rgba(240, 144, 96, 0.4);
}
</style>