import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { createApp } from 'vue'
import FeatureCard from './components/FeatureCard.vue'
import FireworksButton from './components/FireworksButton.vue'
import ReadingProgress from './components/ReadingProgress.vue'
import BackToTop from './components/BackToTop.vue'
import ScrollReveal from './components/ScrollReveal.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router }) {
    app.component('FeatureCard', FeatureCard)

    // Dispatch a custom event when VitePress route changes,
    // so overlay components (mounted in a separate app) can react.
    if (router && typeof window !== 'undefined') {
      router.onAfterRouteChanged = (to) => {
        window.dispatchEvent(new CustomEvent('vitepress-route-changed', { detail: to }))
      }
    }
  }
} satisfies Theme

// Mount overlay components directly on <body>, completely outside the VitePress Layout DOM.
// This prevents any interference with the nav bar / flexbox layout.
if (typeof window !== 'undefined') {
  const mountOverlays = () => {
    const container = document.createElement('div')
    container.id = 'global-ui-root'
    // Zero-size fixed container — children use their own position:fixed
    container.style.cssText = 'position:fixed;top:0;left:0;width:0;height:0;overflow:visible;pointer-events:none;z-index:9999;'
    document.body.appendChild(container)

    const overlayApp = createApp({
      template: `
        <FireworksButton />
        <ReadingProgress />
        <BackToTop />
        <ScrollReveal />
      `
    })
    overlayApp.component('FireworksButton', FireworksButton)
    overlayApp.component('ReadingProgress', ReadingProgress)
    overlayApp.component('BackToTop', BackToTop)
    overlayApp.component('ScrollReveal', ScrollReveal)
    overlayApp.mount(container)
  }

  if (document.readyState === 'complete') {
    requestAnimationFrame(mountOverlays)
  } else {
    window.addEventListener('load', () => requestAnimationFrame(mountOverlays))
  }
}