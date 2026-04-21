<template>
  <span class="typewriter">
    <span>{{ displayText }}</span>
    <span v-if="cursorVisible" class="cursor">|</span>
  </span>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const props = defineProps<{
  text: string
  speed?: number
  delay?: number
}>()

const displayText = ref('')
const cursorVisible = ref(true)
let intervalId: ReturnType<typeof setInterval> | null = null

function typeText() {
  displayText.value = ''
  cursorVisible.value = true
  if (intervalId) clearInterval(intervalId)

  let i = 0
  const speed = props.speed || 50
  const delay = props.delay || 0

  setTimeout(() => {
    intervalId = setInterval(() => {
      if (i < props.text.length) {
        displayText.value += props.text[i]
        i++
      } else {
        if (intervalId) clearInterval(intervalId)
        // Blink cursor a few times, then hide
        let blinks = 0
        const blinkInterval = setInterval(() => {
          cursorVisible.value = !cursorVisible.value
          blinks++
          if (blinks >= 6) {
            clearInterval(blinkInterval)
            cursorVisible.value = false
          }
        }, 530)
      }
    }, speed)
  }, delay)
}

onMounted(() => {
  typeText()
})

watch(() => props.text, () => {
  typeText()
})
</script>

<style scoped>
.typewriter {
  display: inline;
}

.cursor {
  animation: cursor-blink 0.53s ease-in-out infinite;
  color: var(--vp-c-brand-1);
  font-weight: 300;
}

@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
