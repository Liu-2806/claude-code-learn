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
    if (typeof window !== 'undefined') {
      // Scroll to a heading within the independent .content scroll container
      function scrollToHeadingInContent(id: string): boolean {
        // Try raw ID first (Chinese headings), then decoded form
        let heading = document.getElementById(id)
        if (!heading) {
          try { heading = document.getElementById(decodeURIComponent(id)) } catch {}
        }
        if (!heading) return false

        // Find the .content scroll container — works with or without sidebar
        const contentEl = document.querySelector('.VPDoc .content')
        if (!contentEl) return false

        // Only handle independent scroll when content has overflow-y:auto
        const style = getComputedStyle(contentEl)
        if (style.overflowY !== 'auto') return false

        const containerRect = contentEl.getBoundingClientRect()
        const headingRect = heading.getBoundingClientRect()
        if (headingRect.height === 0 && headingRect.width === 0) return false

        const offset = headingRect.top - containerRect.top + contentEl.scrollTop - 32
        contentEl.scrollTo({ top: offset, behavior: 'smooth' })
        return true
      }

      // Capture-phase listener to intercept outline link clicks
      document.addEventListener('click', (e: MouseEvent) => {
        const target = e.target as HTMLElement
        const link = target.closest('a[href^="#"]') as HTMLAnchorElement | null
        if (!link) return

        // Only handle links inside the outline area
        const isOutline = link.closest('.VPDocAside') ||
                          link.closest('.VPDocAsideOutline') ||
                          link.closest('.aside-container')
        if (!isOutline) return

        const href = link.getAttribute('href')
        if (!href || !href.startsWith('#')) return

        const id = href.slice(1) // URL-encoded or raw
        if (!id) return

        // preventDefault stops native window-scroll to anchor,
        // but DON'T stopPropagation — let VitePress router handle hash update
        e.preventDefault()

        // Small delay for any pending renders
        setTimeout(() => {
          scrollToHeadingInContent(id)
        }, 50)
      }, true)

      // Handle browser back/forward to restore scroll position within .content
      window.addEventListener('popstate', () => {
        const hash = window.location.hash.slice(1)
        if (hash) {
          setTimeout(() => scrollToHeadingInContent(hash), 100)
        }
      })
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