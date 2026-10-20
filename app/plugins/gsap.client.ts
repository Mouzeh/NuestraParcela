import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
gsap.defaults({ ease: 'expo.out', duration: 1 })

export default defineNuxtPlugin((nuxtApp) => {
  // Las fuentes y las imágenes cambian la altura de la página: se recalculan los disparadores al terminar de cargar.
  nuxtApp.hook('app:mounted', () => {
    window.addEventListener('load', () => ScrollTrigger.refresh())
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  })
  return { provide: { gsap, ScrollTrigger } }
})
