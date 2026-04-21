<template>
  <Transition name="back-to-top">
    <button
      v-show="visible"
      class="back-to-top-btn"
      @click="scrollToTop"
      aria-label="回到顶部"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)
let scrollContainer: Element | Window | null = null
let scrollEl: Element | null = null

function findScrollContainer() {
  const contentEl = document.querySelector('.VPDoc.has-sidebar .content')
  if (contentEl && window.innerWidth >= 960) {
    scrollContainer = contentEl
    scrollEl = contentEl
  } else {
    scrollContainer = window
    scrollEl = null
  }
}

function checkScroll() {
  if (scrollContainer instanceof Window) {
    visible.value = window.scrollY > 300
  } else if (scrollContainer instanceof Element) {
    visible.value = scrollContainer.scrollTop > 300
  }
}

function scrollToTop() {
  findScrollContainer()
  if (scrollContainer instanceof Window) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else if (scrollContainer instanceof Element) {
    scrollContainer.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function detachScrollListener() {
  if (scrollEl) {
    scrollEl.removeEventListener('scroll', checkScroll)
  } else {
    window.removeEventListener('scroll', checkScroll)
  }
}

function attachScrollListener() {
  findScrollContainer()
  if (scrollContainer instanceof Window) {
    window.addEventListener('scroll', checkScroll, { passive: true })
  } else if (scrollContainer instanceof Element) {
    scrollContainer.addEventListener('scroll', checkScroll, { passive: true })
  }
  checkScroll()
}

function onRouteChanged() {
  visible.value = false
  detachScrollListener()
  setTimeout(() => attachScrollListener(), 300)
}

function onResize() {
  detachScrollListener()
  attachScrollListener()
}

onMounted(() => {
  attachScrollListener()
  window.addEventListener('vitepress-route-changed', onRouteChanged)
  window.addEventListener('popstate', onRouteChanged)
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  detachScrollListener()
  window.removeEventListener('vitepress-route-changed', onRouteChanged)
  window.removeEventListener('popstate', onRouteChanged)
  window.removeEventListener('resize', onResize)
})
</script>

<style scoped>
.back-to-top-btn {
  position: fixed;
  bottom: 32px;
  right: 32px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #E8713A, #F09060);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9997;
  box-shadow: 0 4px 16px rgba(232, 113, 58, 0.35);
  transition: transform 0.25s ease, box-shadow 0.25s ease, opacity 0.25s ease;
}

.back-to-top-btn:hover {
  transform: scale(1.15);
  box-shadow: 0 6px 24px rgba(232, 113, 58, 0.5);
}

@media (max-width: 959px) {
  .back-to-top-btn {
    bottom: 16px;
    right: 16px;
    width: 40px;
    height: 40px;
  }
}

.back-to-top-btn:active {
  transform: scale(0.95);
}

.back-to-top-enter-active,
.back-to-top-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.back-to-top-enter-from,
.back-to-top-leave-to {
  opacity: 0;
  transform: scale(0.6) translateY(10px);
}
</style>