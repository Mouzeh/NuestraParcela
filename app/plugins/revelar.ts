// v-revelar: el elemento sube y aparece una vez al entrar en pantalla (GSAP + ScrollTrigger).
// v-revelar="2" retrasa la entrada 2 pasos (80 ms c/u) para escalonar las partes de una sección.
// El estado oculto inicial solo existe con la clase .js en <html> y sin "reducir movimiento",
// así el contenido nunca queda escondido si el JavaScript falla.
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive<HTMLElement, number | undefined>('revelar', {
    getSSRProps: () => ({ 'data-revelar': '' }),
    mounted(el, b) {
      el.setAttribute('data-revelar', '')
      if (import.meta.server) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return el.classList.add('visible')
      gsap.registerPlugin(ScrollTrigger)
      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top 92%',
        once: true,
        onEnter: () =>
          gsap.fromTo(
            el,
            { autoAlpha: 0, y: 32 },
            { autoAlpha: 1, y: 0, duration: 1.1, delay: (b.value ?? 0) * 0.08, onStart: () => el.classList.add('visible') },
          ),
      })
      ;(el as any).__revelar = st
    },
    unmounted(el) {
      ;(el as any).__revelar?.kill()
    },
  })
})
