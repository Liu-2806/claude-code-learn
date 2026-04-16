<template>
  <div class="reading-progress" :style="{ width: progress + '%' }" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const progress = ref(0)
let scrollContainer: Element | Window | null = null

function updateProgress() {
  let scrollTop: number, scrollHeight: number, clientHeight: number

  if (scrollContainer instanceof Window) {
    scrollTop = window.scrollY || document.documentElement.scrollTop
    scrollHeight = document.documentElement.scrollHeight
    clientHeight = document.documentElement.clientHeight
  } else if (scrollContainer instanceof Element) {
    scrollTop = scrollContainer.scrollTop
    scrollHeight = scrollContainer.scrollHeight
    clientHeight = scrollContainer.clientHeight
  } else {
    progress.value = 0
    return
  }

  if (scrollHeight - clientHeight <= 0) {
    progress.value = 0
    return
  }
  const scrolled = scrollTop / (scrollHeight - clientHeight)
  progress.value = Math.min(Math.max(scrolled * 100, 0), 100)
}

function findScrollContainer() {
  // On doc pages with sidebar (desktop), the .content div is the scroll container.
  // On home page and mobile, the window is the scroll container.
  const contentEl = document.querySelector('.VPDoc.has-sidebar .content')
  if (contentEl && window.innerWidth >= 960) {
    scrollContainer = contentEl
  } else {
    scrollContainer = window
  }
}

function attachScrollListener() {
  findScrollContainer()
  if (scrollContainer) {
    scrollContainer.addEventListener('scroll', updateProgress, { passive: true })
  }
  updateProgress()
}

function detachScrollListener() {
  if (scrollContainer) {
    scrollContainer.removeEventListener('scroll', updateProgress)
  }
}

function onRouteChanged() {
  progress.value = 0
  detachScrollListener()
  // Wait for the new page to render, then re-attach
  setTimeout(() => {
    attachScrollListener()
  }, 300)
}

onMounted(() => {
  attachScrollListener()
  window.addEventListener('vitepress-route-changed', onRouteChanged)
  window.addEventListener('popstate', onRouteChanged)
  // Also handle resize — container may switch between window and .content
  window.addEventListener('resize', () => {
    detachScrollListener()
    attachScrollListener()
  })
})

onUnmounted(() => {
  detachScrollListener()
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