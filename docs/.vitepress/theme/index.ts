import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { createApp } from 'vue'
import FeatureCard from './components/FeatureCard.vue'
import FireworksButton from './components/FireworksButton.vue'
import ReadingProgress from './components/ReadingProgress.vue'
import BackToTop from './components/BackToTop.vue'
import ScrollReveal from './components/ScrollReveal.vue'
import CursorGlow from './components/CursorGlow.vue'
import TypeWriter from './components/TypeWriter.vue'
import ParticlesBg from './components/ParticlesBg.vue'
import ClickRipple from './components/ClickRipple.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app, router }) {
    app.component('FeatureCard', FeatureCard)
    app.component('TypeWriter', TypeWriter)

    // Dispatch a custom event when VitePress route changes,
    // so overlay components (mounted in a separate app) can react.
    // Also fix: hash-based scroll on route change doesn't work with
    // independent .content scroll, so we manually scroll after route change.
    if (router && typeof window !== 'undefined') {
      router.onAfterRouteChanged = (to) => {
        window.dispatchEvent(new CustomEvent('vitepress-route-changed', { detail: to }))

        // Fix: scroll to hash anchor within .content container after route change
        if (to.includes('#')) {
          const id = to.split('#')[1]
          // Wait for content to render
          setTimeout(() => {
            const heading = document.getElementById(decodeURIComponent(id))
            if (!heading) return

            const contentEl = document.querySelector('.VPDoc.has-sidebar .content')
            const scrollTarget = (contentEl && window.innerWidth >= 960) ? contentEl : window

            if (scrollTarget instanceof Element) {
              const containerRect = scrollTarget.getBoundingClientRect()
              const headingRect = heading.getBoundingClientRect()
              const currentScroll = scrollTarget.scrollTop
              const offset = headingRect.top - containerRect.top + currentScroll - 32
              scrollTarget.scrollTo({ top: offset, behavior: 'smooth' })
            } else {
              heading.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
          }, 100)
        }
      }
    }

    // Fix: outline (right-side TOC) clicks don't scroll the content area
    // because the content div uses overflow-y:auto (independent scroll).
    // Native anchor navigation scrolls the document, not nested scrollable containers.
    // Intercept outline link clicks and manually scroll within the .content container.
    if (typeof window !== 'undefined') {
      document.addEventListener('click', (e: MouseEvent) => {
        const target = e.target as HTMLElement
        // VitePress outline links are <a> elements inside .VPDocOutline
        const outlineLink = target.closest('a.outline-link')
        if (!outlineLink) return

        const href = outlineLink.getAttribute('href')
        if (!href || !href.startsWith('#')) return

        const id = href.slice(1)
        const heading = document.getElementById(id)
        if (!heading) return

        // Find the scrollable .content container (desktop) or fall back to window (mobile)
        const contentEl = document.querySelector('.VPDoc.has-sidebar .content')
        const scrollTarget = (contentEl && window.innerWidth >= 960) ? contentEl : window

        if (scrollTarget instanceof Element) {
          // Calculate heading position relative to the scrollable container
          const containerRect = scrollTarget.getBoundingClientRect()
          const headingRect = heading.getBoundingClientRect()
          const currentScroll = scrollTarget.scrollTop
          const offset = headingRect.top - containerRect.top + currentScroll - 32
          scrollTarget.scrollTo({ top: offset, behavior: 'smooth' })
        } else {
          // Mobile: window scroll works fine
          heading.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }

        e.preventDefault()
      }, true) // use capture phase to intercept before VitePress's handler
    }

    // Navbar scroll glass effect: add .scrolled class when user scrolls
    if (typeof window !== 'undefined') {
      const updateNavScroll = () => {
        const nav = document.querySelector('.VPNav')
        if (!nav) return
        const scrollY = window.scrollY || document.documentElement.scrollTop
        if (scrollY > 10) {
          nav.classList.add('scrolled')
        } else {
          nav.classList.remove('scrolled')
        }
      }
      window.addEventListener('scroll', updateNavScroll, { passive: true })
      updateNavScroll()
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
        <ParticlesBg />
        <CursorGlow />
        <ClickRipple />
        <FireworksButton />
        <ReadingProgress />
        <BackToTop />
        <ScrollReveal />
      `
    })
    overlayApp.component('ParticlesBg', ParticlesBg)
    overlayApp.component('CursorGlow', CursorGlow)
    overlayApp.component('ClickRipple', ClickRipple)
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