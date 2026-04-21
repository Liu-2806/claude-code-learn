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

function spawnParticles(x: number, y: number, count: number, speedRange: [number, number], lifeRange: [number, number], sizeRange: [number, number]) {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5
    const speed = speedRange[0] + Math.random() * (speedRange[1] - speedRange[0])
    const maxLife = lifeRange[0] + Math.random() * (lifeRange[1] - lifeRange[0])
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: maxLife,
      maxLife,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0])
    })
  }
  if (!animating) {
    animating = true
    animate()
  }
}

function createFireworks(x: number, y: number) {
  spawnParticles(x, y, 50, [2, 6], [30, 60], [2, 4])
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
    const canvas = canvasRef.value
    if (!canvas || !containerRef.value) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    spawnParticles(btnRect.left + btnRect.width / 2, btnRect.top + btnRect.height / 2, 20, [1, 3], [15, 30], [1.5, 2.5])
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