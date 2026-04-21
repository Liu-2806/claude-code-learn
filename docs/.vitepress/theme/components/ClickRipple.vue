<template>
  <div class="click-ripple-container" ref="containerRef" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const containerRef = ref<HTMLDivElement>()

interface Ripple {
  el: HTMLDivElement
  createdAt: number
}

let ripples: Ripple[] = []

function createRipple(x: number, y: number) {
  const ripple = document.createElement('div')
  ripple.className = 'click-ripple'
  ripple.style.left = x + 'px'
  ripple.style.top = y + 'px'
  containerRef.value?.appendChild(ripple)
  ripples.push({ el: ripple, createdAt: Date.now() })

  // Clean up after animation
  setTimeout(() => {
    ripple.remove()
    ripples = ripples.filter(r => r.el !== ripple)
  }, 800)
}

function onClick(e: MouseEvent) {
  // Only create ripple on interactive elements
  const target = e.target as HTMLElement
  const isInteractive = target.closest('button, a, .VPButton, .feature-card, .custom-block')
  if (!isInteractive) return
  createRipple(e.clientX, e.clientY)
}

onMounted(() => {
  document.addEventListener('click', onClick, true)
})

onUnmounted(() => {
  document.removeEventListener('click', onClick, true)
})
</script>

<style scoped>
.click-ripple-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9996;
}

.click-ripple {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(232, 113, 58, 0.4) 0%, transparent 70%);
  transform: translate(-50%, -50%) scale(0);
  animation: ripple-expand 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  pointer-events: none;
}

@keyframes ripple-expand {
  to {
    transform: translate(-50%, -50%) scale(8);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .click-ripple {
    animation-duration: 0.01ms !important;
  }
}
</style>
