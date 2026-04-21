<template>
  <div class="particles-bg" ref="containerRef">
    <canvas ref="canvasRef" />
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
  radius: number
  opacity: number
  hue: number
}

let particles: Particle[] = []
let animFrameId = 0
let mouseX = 0
let mouseY = 0
let isHome = false

function createParticles(width: number, height: number) {
  particles = []
  const count = Math.min(Math.floor((width * height) / 15000), 80)
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2,
      hue: 15 + Math.random() * 25, // orange-ish range
    })
  }
}

function animate() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  for (const p of particles) {
    // Mouse repulsion
    const dx = p.x - mouseX
    const dy = p.y - mouseY
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < 150) {
      const force = (150 - dist) / 150 * 0.02
      p.vx += (dx / dist) * force
      p.vy += (dy / dist) * force
    }

    p.x += p.vx
    p.y += p.vy
    p.vx *= 0.999
    p.vy *= 0.999

    // Wrap around edges
    if (p.x < 0) p.x = canvas.width
    if (p.x > canvas.width) p.x = 0
    if (p.y < 0) p.y = canvas.height
    if (p.y > canvas.height) p.y = 0

    // Draw particle
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
    ctx.fillStyle = `hsla(${p.hue}, 75%, 55%, ${p.opacity})`
    ctx.fill()
  }

  // Draw connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x
      const dy = particles[i].y - particles[j].y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 120) {
        ctx.beginPath()
        ctx.moveTo(particles[i].x, particles[i].y)
        ctx.lineTo(particles[j].x, particles[j].y)
        ctx.strokeStyle = `rgba(232, 113, 58, ${(1 - dist / 120) * 0.15})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }
    }
  }

  animFrameId = requestAnimationFrame(animate)
}

function onMouseMove(e: MouseEvent) {
  mouseX = e.clientX
  mouseY = e.clientY
}

function onResize() {
  const canvas = canvasRef.value
  if (!canvas) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

function checkRoute() {
  // Only show particles on home page
  isHome = window.location.pathname.endsWith('/') || window.location.pathname.endsWith('/index.html') || window.location.pathname === '/claude-code-learn/'
  const canvas = canvasRef.value
  if (!canvas) return
  if (isHome) {
    createParticles(canvas.width, canvas.height)
  } else {
    particles = []
  }
}

onMounted(() => {
  onResize()
  checkRoute()
  animate()
  document.addEventListener('mousemove', onMouseMove, { passive: true })
  window.addEventListener('resize', onResize)
  window.addEventListener('vitepress-route-changed', checkRoute)
})

onUnmounted(() => {
  cancelAnimationFrame(animFrameId)
  document.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('resize', onResize)
  window.removeEventListener('vitepress-route-changed', checkRoute)
})
</script>

<style scoped>
.particles-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
}

@media (max-width: 768px) {
  .particles-bg {
    display: none;
  }
}
</style>
