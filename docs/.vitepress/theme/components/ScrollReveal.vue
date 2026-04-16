<template>
  <div class="scroll-reveal" />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
let observer: IntersectionObserver | null = null
let currentObserved: Element[] = []

function setupObserver() {
  // Clean up previous
  if (observer) {
    currentObserved.forEach(el => {
      el.classList.remove('scroll-reveal-target', 'revealed')
      observer?.unobserve(el)
    })
  }

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
          observer?.unobserve(entry.target)
        }
      }
    },
    { threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
  )

  // Wait a bit for the page content to render
  setTimeout(() => {
    const contentEls = document.querySelectorAll(
      '.vp-doc h2, .vp-doc h3, .vp-doc p, .vp-doc ul, .vp-doc ol, .vp-doc table, .vp-doc .custom-block'
    )
    currentObserved = Array.from(contentEls)
    currentObserved.forEach(el => {
      el.classList.add('scroll-reveal-target')
      observer?.observe(el)
    })
  }, 100)
}

onMounted(() => {
  setupObserver()
})

// Re-observe on route change (VitePress SPA navigation)
watch(() => route.path, () => {
  setupObserver()
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<style>
.scroll-reveal-target {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.scroll-reveal-target.revealed {
  opacity: 1;
  transform: translateY(0);
}
</style>

<style scoped>
.scroll-reveal {
  display: none;
}
</style>