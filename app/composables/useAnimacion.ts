import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type Preparar = (ctx: { gsap: typeof gsap; ScrollTrigger: typeof ScrollTrigger; raiz: HTMLElement }) => void

// Corre animaciones GSAP dentro de `raiz` solo si la persona no pidió menos movimiento.
// Todo lo creado se revierte al desmontar el componente.
export const useAnimacion = (raiz: Ref<HTMLElement | undefined>, preparar: Preparar) => {
  let mm: gsap.MatchMedia | null = null
  onMounted(() => {
    if (!raiz.value) return
    mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      preparar({ gsap, ScrollTrigger, raiz: raiz.value! })
    }, raiz.value)
  })
  onBeforeUnmount(() => mm?.revert())
}
