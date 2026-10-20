<script setup lang="ts">
import { fotos, foto } from '~~/data/fotos'

// Cuatro franjas de ancho desigual; al pasar el cursor, la franja se abre.
const franjas = [
  { n: 6, crece: 5 },
  { n: 10, crece: 2 },
  { n: 2, crece: 3 },
  { n: 11, crece: 2 },
].map((f) => ({ ...f, ...foto(f.n), indice: fotos.findIndex((x) => x.n === f.n) }))

const { abrir } = useVisor()

const raiz = ref<HTMLElement>()
useAnimacion(raiz, ({ gsap, raiz }) => {
  const banda = raiz.querySelector('.banda')
  gsap.fromTo(
    raiz.querySelectorAll('.franja'),
    { clipPath: 'inset(100% 0 0 0)' },
    { clipPath: 'inset(0% 0 0 0)', duration: 1.4, stagger: 0.1, ease: 'expo.inOut', scrollTrigger: { trigger: banda, start: 'top 80%', once: true } },
  )
  gsap.fromTo(
    raiz.querySelectorAll('.franja img'),
    { yPercent: -6, scale: 1.12 },
    { yPercent: 6, scale: 1.12, ease: 'none', scrollTrigger: { trigger: banda, start: 'top bottom', end: 'bottom top', scrub: true } },
  )
})
</script>

<template>
  <section id="terreno" ref="raiz" class="terreno">
    <div class="contenedor">
      <h2 v-revelar>Así está hoy el terreno</h2>
    </div>
    <div class="banda">
      <button
        v-for="(f, i) in franjas"
        :key="f.n"
        class="franja"
        :style="{ '--crece': f.crece, '--i': i }"
        :aria-label="`Ampliar foto: ${f.alt}`"
        @click="abrir(f.indice)"
      >
        <img :src="`/img/foto${f.n}.webp`" :alt="f.alt" loading="lazy" decoding="async" :width="f.w" :height="f.h" />
        <span v-if="i === 0" class="titulo">Praderas planas<br />y álamos grandes</span>
      </button>
    </div>
    <div class="contenedor pie">
      <p>Fotos tomadas en el terreno, sin retoque.</p>
      <button class="enlace" @click="abrir(0)">Ver las {{ fotos.length }} fotos <Icono nombre="flecha" /></button>
    </div>
  </section>
</template>

<style scoped>
.terreno {
  margin-top: var(--entre-secciones);
}
h2 {
  padding-left: calc((100% - 2 * var(--margen)) / 12 * 2);
  margin-bottom: 56px;
}
.banda {
  display: flex;
  height: 68svh;
  min-height: 440px;
}
.franja {
  position: relative;
  flex: var(--crece) 1 0;
  min-width: 0;
  padding: 0;
  border: 0;
  overflow: hidden;
  background: var(--superficie);
  transition: flex-grow 0.5s var(--facil);
}
.franja img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.titulo {
  position: absolute;
  top: 24px;
  left: 24px;
  padding: 8px 14px;
  background: var(--velo);
  color: var(--papel);
  font-size: var(--paso-lead);
  line-height: 1.15;
  text-align: left;
}
@media (hover: hover) and (min-width: 721px) {
  .franja:hover {
    flex-grow: 6;
  }
}
@media (prefers-reduced-motion: no-preference) {
  .js .franja {
    clip-path: inset(100% 0 0 0);
  }
}
.pie {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px 24px;
  padding-top: 20px;
}
.pie .enlace {
  border: 0;
  background: none;
  padding: 0;
}
@media (max-width: 720px) {
  h2 {
    padding-left: 0;
    margin-bottom: 32px;
  }
  /* Dos filas desiguales: 64/36 arriba y 36/64 abajo. */
  .banda {
    display: grid;
    grid-template-columns: 36fr 28fr 36fr;
    grid-template-rows: 1fr 1fr;
    height: 84svh;
  }
  .franja:nth-child(1) {
    grid-column: 1 / 3;
  }
  .franja:nth-child(2) {
    grid-column: 3;
  }
  .franja:nth-child(3) {
    grid-column: 1;
  }
  .franja:nth-child(4) {
    grid-column: 2 / 4;
  }
  .titulo {
    top: 16px;
    left: 16px;
    font-size: var(--paso-cuerpo);
  }
}
</style>
