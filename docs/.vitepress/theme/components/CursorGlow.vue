<template>
  <div
    class="cursor-glow"
    :style="{ left: x + 'px', top: y + 'px' }"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const x = ref(-100)
const y = ref(-100)
let rafId = 0
let targetX = -100
let targetY = -100

function onMouseMove(e: MouseEvent) {
  targetX = e.clientX
  targetY = e.clientY
}

function animate() {
  const dx = targetX - x.value
  const dy = targetY - y.value
  x.value += dx * 0.15
  y.value += dy * 0.15
  rafId = requestAnimationFrame(animate)
}

onMounted(() => {
  document.addEventListener('mousemove', onMouseMove, { passive: true })
  rafId = requestAnimationFrame(animate)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', onMouseMove)
  cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.cursor-glow {
  position: fixed;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9998;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(232, 113, 58, 0.08) 0%, transparent 70%);
  mix-blend-mode: screen;
}

@media (max-width: 768px) {
  .cursor-glow {
    display: none;
  }
}
</style>
