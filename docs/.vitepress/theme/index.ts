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
      function scrollToHeadingInContent(id: string) {
        const heading = document.getElementById(id)
        if (!heading) return false

        // Desktop with sidebar: .content is the scrollable container
        const contentEl = document.querySelector('.VPDoc.has-sidebar .content')
        if (!contentEl || window.innerWidth < 960) return false

        const containerRect = contentEl.getBoundingClientRect()
        const headingRect = heading.getBoundingClientRect()

        // If heading rect is essentially zero, it might not be rendered yet
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

        // Only handle links inside the aside/outline area
        const isOutline = link.closest('.VPDocAside') ||
                          link.closest('.aside-container') ||
                          link.closest('.VPODocOutlineItem')
        if (!isOutline) return

        const href = link.getAttribute('href')
        if (!href || !href.startsWith('#')) return

        const id = decodeURIComponent(href.slice(1))

        // Check if heading exists in DOM
        const heading = document.getElementById(id)
        if (!heading) return

        // If .content scroll container exists (desktop + sidebar), handle it manually
        const contentEl = document.querySelector('.VPDoc.has-sidebar .content')
        if (contentEl && window.innerWidth >= 960) {
          e.preventDefault()
          e.stopPropagation()

          // Use a small delay to handle CSS animation settling
          setTimeout(() => scrollToHeadingInContent(id), 50)

          // Update URL hash for back button support
          if (window.location.hash !== '#' + id) {
            history.pushState(null, '', '#' + id)
          }
        }
        // Otherwise let VitePress's native handler work (mobile/no-sidebar)
      }, true)

      // Handle browser back/forward to restore scroll position within .content
      window.addEventListener('popstate', () => {
        const hash = window.location.hash.slice(1)
        if (hash) {
          setTimeout(() => scrollToHeadingInContent(decodeURIComponent(hash)), 100)
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