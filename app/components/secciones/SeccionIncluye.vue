<script setup lang="ts">
import { incluye } from '~~/data/incluye'
import { foto } from '~~/data/fotos'

// La foto queda fija mientras se avanza: cada tramo de scroll activa el siguiente punto.
const activo = ref(0)
const marcas = ref<HTMLElement[]>([])

onMounted(() => {
  if (!('IntersectionObserver' in window)) return
  const obs = new IntersectionObserver(
    (entradas) =>
      entradas.forEach((e) => {
        if (e.isIntersecting) activo.value = Number((e.target as HTMLElement).dataset.paso)
      }),
    { rootMargin: '-50% 0px -50% 0px' },
  )
  marcas.value.forEach((m) => obs.observe(m))
  onBeforeUnmount(() => obs.disconnect())
})

const pares = incluye.map((p) => p.fotos.map(foto))

const raiz = ref<HTMLElement>()
useAnimacion(raiz, ({ gsap, raiz }) => {
  gsap.fromTo(raiz.querySelector('.fondo'), { scale: 1 }, { scale: 1.15, ease: 'none', scrollTrigger: { trigger: raiz, start: 'top top', end: 'bottom bottom', scrub: true } })
})
</script>

<template>
  <section id="incluye" ref="raiz" class="incluye" :style="{ '--pasos': incluye.length }">
    <div class="escena">
      <img class="fondo" src="/img/foto4.webp" alt="Árbol solitario en medio de la pradera" loading="lazy" width="1600" height="899" />
      <div class="pila">
        <h2>Lo que ya está hecho</h2>
        <ol>
          <li v-for="(p, i) in incluye" :key="p.titulo" :class="{ activo: activo === i }">
            <span class="punto">{{ p.titulo }}</span>
            <span class="detalle"><span>{{ p.texto }}</span></span>
          </li>
        </ol>
      </div>
      <template v-for="(par, i) in pares" :key="i">
        <img
          v-for="(f, j) in par"
          :key="`${i}-${f.n}`"
          :src="`/img/foto${f.n}-sm.webp`"
          alt=""
          loading="lazy"
          class="mini"
          :class="[`mini-${j + 1}`, { visible: activo === i }]"
          :width="f.w"
          :height="f.h"
        />
      </template>
    </div>
    <div class="marcas" aria-hidden="true">
      <div v-for="(p, i) in incluye" :key="p.titulo" ref="marcas" :data-paso="i" class="marca" />
    </div>
  </section>
</template>

<style scoped>
.incluye {
  position: relative;
  margin-top: var(--entre-secciones);
  height: calc(100svh + var(--pasos) * 60svh);
  background: var(--bosque);
}
.escena {
  position: sticky;
  top: 0;
  height: 100svh;
  overflow: hidden;
  color: var(--papel);
  isolation: isolate;
}
.fondo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -2;
}
.escena::before {
  content: '';
  position: absolute;
  inset: 0 0 35%;
  background: linear-gradient(to bottom, rgba(10, 16, 11, 0.8) 55%, rgba(10, 16, 11, 0)); /* taste-skill-ignore: velo neutro bajo el texto */
  z-index: -1;
}
.pila {
  position: absolute;
  top: 0;
  left: 50%;
  translate: -50% 0;
  width: min(100% - 2 * var(--margen), 44ch);
  padding-top: clamp(40px, 8svh, 80px);
  text-align: center;
}
h2 {
  font-size: var(--paso-lead);
  font-weight: 500;
  letter-spacing: -0.01em;
  margin-bottom: 14px;
}
ol {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 6px;
}
.punto {
  display: block;
  font-size: var(--paso-cuerpo);
  color: var(--sobre-bosque-suave);
  transition: color 0.3s;
}
.activo .punto {
  color: var(--papel);
  font-weight: 500;
}
.detalle {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.4s var(--facil);
}
.detalle > span {
  overflow: hidden;
  font-size: var(--paso-chico);
  color: var(--sobre-bosque);
}
.activo .detalle {
  grid-template-rows: 1fr;
}
.mini {
  position: absolute;
  width: clamp(150px, 15vw, 230px);
  object-fit: cover;
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 0.5s,
    transform 0.7s var(--facil);
}
.mini.visible {
  opacity: 1;
  transform: none;
}
.mini-1 {
  left: max(var(--margen), 8%);
  top: 50%;
  aspect-ratio: 4 / 5;
}
.mini-2 {
  right: max(var(--margen), 9%);
  top: 38%;
  aspect-ratio: 3 / 2;
}
.marcas {
  position: absolute;
  inset: 50svh 0 50svh;
  display: grid;
  grid-template-rows: repeat(var(--pasos), 1fr);
  pointer-events: none;
}
@media (max-width: 720px) {
  .escena::before {
    inset: 30% 0 0;
    background: linear-gradient(to top, rgba(10, 16, 11, 0.85) 60%, rgba(10, 16, 11, 0)); /* taste-skill-ignore: velo neutro bajo el texto */
  }
  .pila {
    top: auto;
    bottom: 0;
    left: var(--margen);
    translate: none;
    padding: 0 0 40px;
    text-align: left;
  }
  .mini-1 {
    left: auto;
    right: 16px;
    top: 16px;
    width: 44vw;
  }
  .mini-2 {
    display: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  .mini {
    transform: none;
  }
}
</style>
