<template>
  <div ref="containerRef" class="fireworks-container">
    <canvas ref="canvasRef" class="fireworks-canvas" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const containerRef = ref<HTMLDivElement>()
const canvasRef = ref<HTMLCanvasElement>()

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
}

let particles: Particle[] = []
let animating = false
let animFrameId: number | null = null

const COLORS = ['#E8713A', '#F09060', '#FCC8A8', '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96E6A1']

function createFireworks(x: number, y: number) {
  const count = 50
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5
    const speed = 2 + Math.random() * 4
    const maxLife = 30 + Math.random() * 30
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: maxLife,
      maxLife,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 2 + Math.random() * 2
    })
  }
  if (!animating) {
    animating = true
    animate()
  }
}

function animate() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  particles = particles.filter(p => p.life > 0)

  for (const p of particles) {
    p.x += p.vx
    p.y += p.vy
    p.vy += 0.08
    p.vx *= 0.99
    p.vy *= 0.99
    p.life -= 1

    const alpha = p.life / p.maxLife
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2)
    ctx.fillStyle = p.color
    ctx.globalAlpha = alpha
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(p.x, p.y)
    ctx.lineTo(p.x - p.vx * 2, p.y - p.vy * 2)
    ctx.strokeStyle = p.color
    ctx.globalAlpha = alpha * 0.3
    ctx.lineWidth = p.size * alpha * 0.5
    ctx.stroke()
  }

  ctx.globalAlpha = 1

  if (particles.length > 0) {
    animFrameId = requestAnimationFrame(animate)
  } else {
    animating = false
  }
}

function triggerFireworksAt(clientX: number, clientY: number) {
  const canvas = canvasRef.value
  if (!canvas || !containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  createFireworks(clientX, clientY)
}

// Single global click handler - no duplicate listener risk
function handleGlobalClick(e: MouseEvent) {
  const target = e.target as HTMLElement

  // Fireworks on hero CTA buttons
  const heroBtn = target.closest('.VPHero .VPButton.brand')
  if (heroBtn) {
    triggerFireworksAt(e.clientX, e.clientY)
    return
  }

  // Mini fireworks on copy code buttons
  const copyBtn = target.closest('.copy')
  if (copyBtn) {
    const btnRect = copyBtn.getBoundingClientRect()
    // Mini fireworks - fewer particles for smaller target
    const canvas = canvasRef.value
    if (!canvas || !containerRef.value) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const count = 20
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5
      const speed = 1 + Math.random() * 2
      const maxLife = 15 + Math.random() * 15
      particles.push({
        x: btnRect.left + btnRect.width / 2,
        y: btnRect.top + btnRect.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: maxLife,
        maxLife,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 1.5 + Math.random() * 1
      })
    }
    if (!animating) {
      animating = true
      animate()
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleGlobalClick, true)
})

onUnmounted(() => {
  document.removeEventListener('click', handleGlobalClick, true)
  if (animFrameId) cancelAnimationFrame(animFrameId)
})
</script>

<style scoped>
.fireworks-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 9999;
}

.fireworks-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>