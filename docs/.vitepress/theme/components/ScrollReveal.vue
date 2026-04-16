<template>
  <div class="scroll-reveal" />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

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

  // Wait for page content to render
  setTimeout(() => {
    const contentEls = document.querySelectorAll(
      '.vp-doc h2, .vp-doc h3, .vp-doc p, .vp-doc ul, .vp-doc ol, .vp-doc table, .vp-doc .custom-block'
    )
    currentObserved = Array.from(contentEls)
    currentObserved.forEach(el => {
      // Only hide elements below current viewport — elements already visible should stay visible
      const rect = el.getBoundingClientRect()
      if (rect.top > window.innerHeight) {
        el.classList.add('scroll-reveal-target')
      }
      observer?.observe(el)
    })
  }, 300)
}

function onRouteChanged() {
  setupObserver()
}

onMounted(() => {
  setupObserver()
  // Listen for VitePress SPA route changes via custom event
  window.addEventListener('vitepress-route-changed', onRouteChanged)
  // Also listen for popstate as fallback
  window.addEventListener('popstate', onRouteChanged)
})

onUnmounted(() => {
  observer?.disconnect()
  window.removeEventListener('vitepress-route-changed', onRouteChanged)
  window.removeEventListener('popstate', onRouteChanged)
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