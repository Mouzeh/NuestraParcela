<script setup lang="ts">
import { sitio } from '~~/data/sitio'

const formatear = (n: number) => (Math.round(n / 10) * 10).toLocaleString('es-CL')

const raiz = ref<HTMLElement>()
useAnimacion(raiz, ({ gsap, raiz }) => {
  const foto = raiz.querySelector('.foto')!
  const entrada = { trigger: foto, start: 'top 65%', once: true }
  // La foto se acerca mientras la sección cruza la pantalla.
  gsap.fromTo(
    foto.querySelector('img'),
    { scale: 1.18 },
    { scale: 1, ease: 'none', scrollTrigger: { trigger: foto, start: 'top bottom', end: 'bottom top', scrub: true } },
  )
  // La cifra cuenta hasta la superficie al entrar.
  const numero = raiz.querySelector<HTMLElement>('[data-cuenta]')!
  const obj = { n: 0 }
  gsap.to(obj, {
    n: sitio.superficieBase,
    duration: 2,
    ease: 'power3.out',
    scrollTrigger: entrada,
    onUpdate: () => (numero.textContent = formatear(obj.n)),
  })
  gsap.fromTo(raiz.querySelectorAll('.titulo, .explica'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, stagger: 0.15, delay: 0.3, scrollTrigger: entrada })
})
</script>

<template>
  <section id="compras" ref="raiz" class="compras" aria-labelledby="compras-titulo">
    <div class="foto">
      <img
        src="/img/foto3.webp"
        srcset="/img/foto3-sm.webp 640w, /img/foto3.webp 1600w"
        sizes="100vw"
        alt="Pradera abierta con álamos al fondo"
        loading="lazy"
        width="1600"
        height="1200"
      />
      <h2 id="compras-titulo" class="titulo">Lo que compras</h2>
      <div class="base">
        <p class="numero"><span data-cuenta>{{ formatear(sitio.superficieBase) }}</span> m²</p>
        <p class="explica">Desde media hectárea con rol propio, escriturada a tu nombre de inmediato.</p>
      </div>
    </div>
    <BandaEstadisticas />
    <ParcelaAEscala />
  </section>
</template>

<style scoped>
.compras {
  margin-top: var(--entre-secciones);
}
.foto {
  position: relative;
  height: 92svh;
  min-height: 540px;
  color: var(--papel);
  isolation: isolate;
  overflow: hidden;
}
.foto img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -2;
}
/* Velo neutro arriba (título) y abajo (cifra); el centro de la foto queda limpio. */
.foto::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(10, 16, 11, 0.55), rgba(10, 16, 11, 0) 28%, rgba(10, 16, 11, 0) 50%, rgba(10, 16, 11, 0.72)); /* taste-skill-ignore: velo neutro bajo el texto */
  z-index: -1;
}
.titulo {
  position: absolute;
  top: clamp(28px, 5vw, 56px);
  left: var(--margen);
  font-size: var(--paso-titulo);
}
.base {
  position: absolute;
  left: var(--margen);
  right: var(--margen);
  bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
}
.numero {
  font-size: var(--paso-display);
  font-weight: 300;
  letter-spacing: -0.05em;
  line-height: 0.8;
  white-space: nowrap;
  margin-left: -0.05em;
  font-variant-numeric: tabular-nums;
}
.explica {
  font-size: var(--paso-lead);
  line-height: 1.3;
  max-width: 22ch;
  text-align: right;
  padding-bottom: 8px;
}
@media (max-width: 720px) {
  .foto {
    height: 82svh;
  }
  .base {
    flex-direction: column-reverse;
    align-items: flex-start;
  }
  .numero {
    font-size: 21vw;
  }
  .explica {
    font-size: var(--paso-cuerpo);
    text-align: left;
  }
}
@media (prefers-reduced-motion: no-preference) {
  .js .titulo,
  .js .explica {
    opacity: 0;
  }
}
</style>
