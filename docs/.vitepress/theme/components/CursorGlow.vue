<template>
  <div class="cursor-glow-wrapper">
    <div
      class="cursor-glow"
      :style="{ left: x + 'px', top: y + 'px' }"
    />
    <div
      class="cursor-ring"
      :style="{ left: ringX + 'px', top: ringY + 'px' }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const x = ref(-100)
const y = ref(-100)
const ringX = ref(-100)
const ringY = ref(-100)
let rafId = 0
let targetX = -100
let targetY = -100

function onMouseMove(e: MouseEvent) {
  targetX = e.clientX
  targetY = e.clientY
}

function animate() {
  // Main glow follows faster
  const dx = targetX - x.value
  const dy = targetY - y.value
  x.value += dx * 0.15
  y.value += dy * 0.15

  // Ring follows slower (trailing effect)
  const rdx = targetX - ringX.value
  const rdy = targetY - ringY.value
  ringX.value += rdx * 0.08
  ringY.value += rdy * 0.08

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
.cursor-glow-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  pointer-events: none;
  z-index: 9998;
}

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

.cursor-ring {
  position: fixed;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9998;
  transform: translate(-50%, -50%);
  border: 1.5px solid rgba(232, 113, 58, 0.3);
  transition: width 0.2s ease, height 0.2s ease, border-color 0.2s ease;
}

.cursor-ring:hover {
  width: 50px;
  height: 50px;
  border-color: rgba(232, 113, 58, 0.5);
}

@media (max-width: 768px) {
  .cursor-glow,
  .cursor-ring {
    display: none;
  }
}
</style>
