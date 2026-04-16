<template>
  <div class="feature-card" @mouseenter="shimmerActive = true" @mouseleave="shimmerActive = false">
    <div class="shimmer-overlay" v-if="shimmerActive" />
    <div class="feature-icon">
      <span class="icon-text">{{ icon }}</span>
    </div>
    <h3 class="feature-title">{{ title }}</h3>
    <p class="feature-details">{{ details }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  icon: string
  title: string
  details: string
}>()

const shimmerActive = ref(false)
</script>

<style scoped>
.feature-card {
  position: relative;
  padding: 24px;
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(232, 113, 58, 0.15), 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #E8713A;
}

:global(.dark) .feature-card:hover {
  box-shadow: 0 12px 32px rgba(240, 144, 96, 0.2), 0 4px 12px rgba(0, 0, 0, 0.12);
  border-color: #F09060;
}

.shimmer-overlay {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(232, 113, 58, 0.06),
    transparent
  );
  animation: shimmer-slide 0.8s ease-out forwards;
}

:global(.dark) .shimmer-overlay {
  background: linear-gradient(
    90deg,
    transparent,
    rgba(240, 144, 96, 0.08),
    transparent
  );
}

@keyframes shimmer-slide {
  from { left: -100%; }
  to { left: 100%; }
}

.feature-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(232, 113, 58, 0.15), rgba(240, 144, 96, 0.08));
  animation: icon-breathe 3s ease-in-out infinite;
}

:global(.dark) .feature-icon {
  background: linear-gradient(135deg, rgba(240, 144, 96, 0.2), rgba(232, 113, 58, 0.1));
}

@keyframes icon-breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.06); }
}

.icon-text {
  font-size: 24px;
  line-height: 1;
}

.feature-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--vp-c-text-1);
}

.feature-details {
  font-size: 14px;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}
</style>