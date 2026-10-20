<script setup lang="ts">
import { sitio, waLink } from '~~/data/sitio'

const letras = [...sitio.nombre]
const raiz = ref<HTMLElement>()
useAnimacion(raiz, ({ gsap, raiz }) => {
  gsap.fromTo(
    raiz.querySelectorAll('.letra'),
    { yPercent: 110 },
    { yPercent: 0, duration: 1.2, stagger: 0.035, scrollTrigger: { trigger: raiz.querySelector('.nombre'), start: 'top 95%', once: true } },
  )
  gsap.fromTo(raiz.querySelector('.fondo'), { scale: 1.15 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: raiz, start: 'top bottom', end: 'bottom bottom', scrub: true } })
})

const enlaces = [
  { href: '#plano', texto: 'Plano interactivo' },
  { href: '#terreno', texto: 'El terreno' },
  { href: '#incluye', texto: 'Qué incluye' },
  { href: '#precio', texto: 'Precio' },
  { href: '#preguntas', texto: 'Preguntas' },
]
</script>

<template>
  <footer ref="raiz" class="pie">
    <img src="/img/foto14.webp" alt="" loading="lazy" width="1600" height="899" class="fondo" />
    <div class="contenedor arriba">
      <nav aria-label="Secciones">
        <a v-for="e in enlaces" :key="e.href" :href="e.href">{{ e.texto }}</a>
      </nav>
      <div class="contacto">
        <a :href="waLink('Hola, quiero información sobre las parcelas.')" target="_blank" rel="noopener">WhatsApp {{ sitio.whatsappVisible }}</a>
        <a :href="`mailto:${sitio.email}`">{{ sitio.email }}</a>
        <a :href="sitio.planoPdf" target="_blank" rel="noopener">Plano de subdivisión (PDF)</a>
        <a :href="sitio.planoKml">Deslindes para Google Earth (KML)</a>
      </div>
    </div>
    <div class="contenedor abajo">
      <p class="nombre" aria-hidden="true">
        <span v-for="(l, i) in letras" :key="i" class="letra">{{ l === ' ' ? '\u00a0' : l }}</span>
      </p>
      <p class="legal">
        © {{ new Date().getFullYear() }} {{ sitio.nombre }} · {{ sitio.ubicacion }}. Fotos tomadas en el terreno.
      </p>
    </div>
  </footer>
</template>

<style scoped>
.pie {
  position: relative;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: var(--sobre-bosque);
  background: var(--bosque);
  isolation: isolate;
  overflow: hidden;
}
.fondo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 55%;
  filter: brightness(0.55);
  z-index: -1;
}
.arriba {
  display: flex;
  justify-content: space-between;
  gap: 32px;
  padding-top: 40px;
}
nav,
.contacto {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.contacto {
  text-align: right;
}
a {
  text-decoration: none;
  width: fit-content;
  overflow-wrap: anywhere;
  transition: opacity 0.2s;
}
.contacto a {
  margin-left: auto;
}
a:hover {
  text-decoration: underline;
  text-underline-offset: 5px;
}
.abajo {
  padding-bottom: 28px;
}
.nombre {
  font-size: var(--paso-display);
  font-weight: 300;
  letter-spacing: -0.05em;
  line-height: 0.85;
  white-space: nowrap;
  margin-left: -0.04em;
  overflow: hidden;
  padding-bottom: 0.06em;
}
.letra {
  display: inline-block;
}
.legal {
  font-size: var(--paso-chico);
  margin-top: 20px;
}
@media (max-width: 720px) {
  .pie {
    min-height: 88svh;
  }
  .arriba {
    flex-direction: column;
  }
  .contacto {
    text-align: left;
  }
  .contacto a {
    margin-left: 0;
  }
}
</style>
