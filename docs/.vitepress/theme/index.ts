import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { h } from 'vue'
import FireworksButton from './components/FireworksButton.vue'
import ReadingProgress from './components/ReadingProgress.vue'
import BackToTop from './components/BackToTop.vue'
import ScrollReveal from './components/ScrollReveal.vue'
import FeatureCard from './components/FeatureCard.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('FireworksButton', FireworksButton)
    app.component('ReadingProgress', ReadingProgress)
    app.component('BackToTop', BackToTop)
    app.component('ScrollReveal', ScrollReveal)
    app.component('FeatureCard', FeatureCard)
  },
  Layout() {
    return h(DefaultTheme.Layout, null, {
      // Inject global overlay components via the layout-bottom slot
      'layout-bottom': () => h('div', { class: 'global-ui-overlay' }, [
        h(FireworksButton),
        h(ReadingProgress),
        h(BackToTop),
        h(ScrollReveal),
      ])
    })
  }
} satisfies Theme