<script setup lang="ts">
import { sitio, clp } from '~~/data/sitio'

// Portada con video de dron. El video solo se carga en el navegador y no se carga
// si la persona pidió menos movimiento o tiene activado el ahorro de datos.
const video = ref<HTMLVideoElement>()
const reproduciendo = ref(false)
const cargar = ref(false)

onMounted(() => {
  const menosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const ahorroDatos = (navigator as any).connection?.saveData === true
  if (menosMovimiento || ahorroDatos) return
  cargar.value = true
  nextTick(() => video.value?.play().then(() => (reproduciendo.value = true)).catch(() => {}))
})

const raiz = ref<HTMLElement>()
useAnimacion(raiz, ({ gsap, raiz }) => {
  gsap.fromTo(raiz.querySelector('.cuerpo'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1.2, delay: 0.6 })
  gsap.fromTo(raiz.querySelector('.fondo'), { scale: 1.12 }, { scale: 1, duration: 2.4 })
  // Al bajar, el video se acerca levemente y el texto sube más rápido que la página.
  const salida = { trigger: raiz, start: 'top top', end: 'bottom top', scrub: true }
  gsap.to(raiz.querySelector('.contenido'), { yPercent: -18, ease: 'none', scrollTrigger: salida })
  gsap.to(raiz.querySelector('.marco-video'), { yPercent: 12, ease: 'none', scrollTrigger: salida })
})

const alternar = () => {
  const v = video.value
  if (!v) return
  if (v.paused) v.play().then(() => (reproduciendo.value = true))
  else {
    v.pause()
    reproduciendo.value = false
  }
}
</script>

<template>
  <section id="inicio" ref="raiz" class="hero">
    <div class="marco-video">
      <video
        ref="video"
        class="fondo"
        :poster="sitio.heroPoster"
        muted
        loop
        playsinline
        preload="none"
        :aria-label="sitio.heroVideoDescripcion"
      >
        <source v-if="cargar" :src="sitio.heroVideo" type="video/mp4" />
      </video>
    </div>
    <div class="contenedor contenido">
      <TituloLineas etiqueta="h1" :lineas="['Media', 'hectárea']" />
      <div class="cuerpo">
        <p class="frase">
          Parcelas desde 5.000 m² con rol propio, a {{ sitio.minutosLosAngeles }} minutos de Los Ángeles.
          Desde <strong>{{ clp(sitio.precio) }}</strong>, directo con el dueño.
        </p>
        <div class="acciones">
          <a href="#plano" class="boton boton-papel">Elegir mi parcela</a>
          <button v-if="cargar" class="enlace pausa" @click="alternar">{{ reproduciendo ? 'Pausar video' : 'Reproducir video' }}</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: flex-end;
  color: var(--papel);
  background: var(--bosque);
  isolation: isolate;
  overflow: hidden;
}
.marco-video {
  position: absolute;
  inset: 0;
  z-index: -2;
  overflow: hidden;
}
.fondo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
/* Velo neutro solo en la mitad inferior, bajo el texto. */
.hero::after {
  content: '';
  position: absolute;
  inset: 40% 0 0;
  background: linear-gradient(to bottom, rgba(10, 16, 11, 0), rgba(10, 16, 11, 0.72)); /* taste-skill-ignore: velo neutro bajo el texto */
  z-index: -1;
}
.contenido {
  display: grid;
  grid-template-columns: 7fr 5fr;
  align-items: end;
  gap: 32px;
  padding-bottom: clamp(28px, 5vh, 56px);
}
h1 {
  font-size: var(--paso-display);
  font-weight: 300;
  letter-spacing: -0.05em;
  line-height: 0.92;
}
h1 :deep(.linea-2) {
  padding-left: 0.6em;
}
.frase {
  font-size: var(--paso-lead);
  line-height: 1.35;
  max-width: 34ch;
}
.frase strong {
  font-weight: 500;
}
.acciones {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px 28px;
  margin-top: 24px;
}
.pausa {
  border: 0;
  background: none;
  padding: 0;
}
@media (max-width: 860px) {
  .contenido {
    grid-template-columns: 1fr;
  }
  h1 {
    font-size: 19vw;
  }
  .frase {
    font-size: var(--paso-cuerpo);
  }
}
@media (prefers-reduced-motion: no-preference) {
  .js .cuerpo {
    opacity: 0;
  }
}
</style>
