<template>
  <a class="feature-card-link" :href="link">
    <div
      ref="cardRef"
      class="feature-card"
      :style="tiltStyle"
      @mouseenter="hovered = true"
      @mouseleave="hovered = false; resetTilt()"
      @mousemove="onTilt"
    >
      <!-- Hover shimmer sweep -->
      <div class="shimmer-overlay" v-if="hovered" />

      <!-- Top-edge glow line -->
      <div class="card-glow-edge" />

      <!-- Floating particles on hover -->
      <div class="card-particles" v-if="hovered">
        <span
          v-for="p in particles"
          :key="p.id"
          class="particle"
          :style="{
            left: p.x + '%',
            top: p.y + '%',
            animationDelay: p.delay + 's',
            animationDuration: p.dur + 's',
            '--p-size': p.size + 'px',
            '--p-color': p.color,
          }"
        />
      </div>

      <div class="feature-icon">
        <span class="icon-text">{{ icon }}</span>
      </div>
      <h3 class="feature-title">
        {{ title }}
        <span class="arrow">→</span>
      </h3>
      <p class="feature-details">{{ details }}</p>
    </div>
  </a>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  icon: string
  title: string
  details: string
  link: string
}>()

const hovered = ref(false)
const cardRef = ref<HTMLElement | null>(null)
const tiltX = ref(0)
const tiltY = ref(0)

const tiltStyle = computed(() => ({
  transform: `perspective(800px) rotateX(${tiltX.value}deg) rotateY(${tiltY.value}deg) ${hovered.value ? 'translateY(-8px) scale(1.02)' : ''}`,
}))

function onTilt(e: MouseEvent) {
  if (!cardRef.value) return
  const rect = cardRef.value.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  const mouseX = e.clientX - centerX
  const mouseY = e.clientY - centerY
  tiltX.value = -(mouseY / (rect.height / 2)) * 6
  tiltY.value = (mouseX / (rect.width / 2)) * 6
}

function resetTilt() {
  tiltX.value = 0
  tiltY.value = 0
}

const PARTICLE_COLORS = ['#E8713A', '#F09060', '#FCC8A8', '#FFD700', '#FF6B6B', '#4ECDC4']

const particles = computed(() => {
  const arr = []
  for (let i = 0; i < 8; i++) {
    arr.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 0.5,
      dur: 1 + Math.random() * 1,
      size: 3 + Math.random() * 4,
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
    })
  }
  return arr
})
</script>

<style scoped>
.feature-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.feature-card {
  position: relative;
  padding: 28px 24px 24px;
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  overflow: hidden;
  transition: box-shadow 0.35s cubic-bezier(.4,0,.2,1),
              border-color 0.35s ease,
              transform 0.3s ease;
  transform-style: preserve-3d;
  cursor: pointer;
}

.feature-card:hover {
  box-shadow:
    0 16px 40px rgba(232, 113, 58, 0.18),
    0 4px 12px rgba(0, 0, 0, 0.06),
    0 0 0 1px rgba(232, 113, 58, 0.3);
  border-color: #E8713A;
}

@media (max-width: 959px) {
  .feature-card:hover {
    box-shadow: 0 8px 20px rgba(232, 113, 58, 0.12);
  }
}

/* Top-edge glow line */
.card-glow-edge {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--vp-c-brand-1), transparent);
  opacity: 0;
  transition: opacity 0.35s ease;
}

.feature-card:hover .card-glow-edge {
  opacity: 0.7;
}

/* Shimmer sweep */
.shimmer-overlay {
  position: absolute;
  top: 0;
  left: -120%;
  width: 120%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(232, 113, 58, 0.05) 40%,
    rgba(232, 113, 58, 0.12) 50%,
    rgba(232, 113, 58, 0.05) 60%,
    transparent 100%
  );
  animation: shimmer-sweep 0.9s ease-out forwards;
  pointer-events: none;
}

@keyframes shimmer-sweep {
  from { left: -120%; }
  to { left: 120%; }
}

/* Floating particles */
.card-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: var(--p-size);
  height: var(--p-size);
  border-radius: 50%;
  background: var(--p-color);
  opacity: 0;
  animation: particle-float linear forwards;
  pointer-events: none;
}

@keyframes particle-float {
  0% { opacity: 0; transform: translateY(0) scale(0); }
  15% { opacity: 0.8; transform: translateY(-8px) scale(1); }
  100% { opacity: 0; transform: translateY(-40px) scale(0.3); }
}

/* Icon */
.feature-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  margin-bottom: 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(232, 113, 58, 0.18), rgba(240, 144, 96, 0.08));
  animation: icon-breathe 3s ease-in-out infinite;
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover .feature-icon {
  background: linear-gradient(135deg, rgba(232, 113, 58, 0.25), rgba(240, 144, 96, 0.12));
  box-shadow: 0 4px 12px rgba(232, 113, 58, 0.2);
}

@keyframes icon-breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.06); }
}

.icon-text {
  font-size: 26px;
  line-height: 1;
}

/* Title */
.feature-title {
  font-size: 17px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--vp-c-text-1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.arrow {
  font-size: 16px;
  color: var(--vp-c-brand-1);
  opacity: 0;
  transform: translateX(-8px);
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.feature-card:hover .arrow {
  opacity: 1;
  transform: translateX(0);
}

/* Details */
.feature-details {
  font-size: 14px;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}
</style>