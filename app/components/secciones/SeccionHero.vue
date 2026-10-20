<script setup lang="ts">
import { sitio, clp } from '~~/data/sitio'

const raiz = ref<HTMLElement>()
useAnimacion(raiz, ({ gsap, raiz }) => {
  const fotos = raiz.querySelectorAll('.chica, .alta')
  gsap.fromTo(fotos, { clipPath: 'inset(100% 0 0 0)', scale: 1.08 }, { clipPath: 'inset(0% 0 0 0)', scale: 1, duration: 1.4, stagger: 0.15 })
  gsap.fromTo(raiz.querySelector('.cuerpo'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1.1, delay: 0.55 })
  const salida = { trigger: raiz, start: 'top top', end: 'bottom top', scrub: true }
  gsap.to(raiz.querySelector('.alta'), { yPercent: -14, ease: 'none', scrollTrigger: salida })
  gsap.to(raiz.querySelector('.chica'), { yPercent: 30, ease: 'none', scrollTrigger: salida })
})
</script>

<template>
  <section id="inicio" ref="raiz" class="hero">
    <div class="contenedor marco">
      <img class="chica" src="/img/foto9.webp" alt="Vista amplia de la pradera del proyecto" width="512" height="384" />
      <TituloLineas etiqueta="h1" :lineas="['Media', 'hectárea']" />
      <div class="cuerpo">
        <p class="frase">
          Parcelas desde 5.000 m² con rol propio, a {{ sitio.minutosLosAngeles }} minutos de Los Ángeles.
          Desde <strong>{{ clp(sitio.precio) }}</strong>, directo con el dueño.
        </p>
        <div class="acciones">
          <a href="#plano" class="boton">Elegir mi parcela</a>
          <a href="#terreno" class="enlace">Ver el terreno <Icono nombre="flecha" /></a>
        </div>
      </div>
      <img
        class="alta"
        src="/img/foto1.webp"
        srcset="/img/foto1-sm.webp 640w, /img/foto1.webp 1200w"
        sizes="(max-width: 720px) 72vw, 34vw"
        alt="Arboleda y pradera en una de las parcelas"
        fetchpriority="high"
        width="1200"
        height="1200"
      />
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100svh;
  overflow: hidden;
}
.marco {
  position: relative;
  min-height: 100svh;
  --col: calc((100% - 2 * var(--margen)) / 12);
}
img {
  object-fit: cover;
}
h1 {
  font-size: var(--paso-display);
  font-weight: 300;
  letter-spacing: -0.05em;
  line-height: 0.92;
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
  margin-top: 28px;
}

/* Escritorio: el título baja en escalón entre dos fotos. */
@media (min-width: 721px) {
  .chica {
    position: absolute;
    top: 13svh;
    right: var(--margen);
    width: calc(var(--col) * 3);
    aspect-ratio: 16 / 10;
  }
  h1 {
    padding-top: 27svh;
  }
  h1 :deep(.linea-1) {
    padding-left: calc(100% / 12);
  }
  h1 :deep(.linea-2) {
    padding-left: calc(100% / 12 * 5);
  }
  .alta {
    position: absolute;
    left: calc(var(--margen) + var(--col));
    top: calc(27svh + var(--paso-display) * 0.92 + 24px);
    width: calc(var(--col) * 4 - 24px);
    aspect-ratio: 4 / 5;
  }
  .cuerpo {
    margin-left: calc(100% / 12 * 5);
    margin-top: 36px;
    padding-bottom: 64px;
  }
}

/* Teléfono: el escalón se mantiene, las fotos pasan a la columna. */
@media (max-width: 720px) {
  .marco {
    display: flex;
    flex-direction: column;
    padding-top: 84px;
  }
  .chica {
    align-self: flex-end;
    width: 46%;
    aspect-ratio: 16 / 10;
  }
  h1 {
    font-size: 17vw;
    margin-top: 20px;
  }
  h1 :deep(.linea-2) {
    padding-left: 18vw;
  }
  .cuerpo {
    margin-top: 20px;
  }
  .frase {
    font-size: var(--paso-cuerpo);
  }
  .alta {
    width: 72%;
    aspect-ratio: 4 / 5;
    margin-top: 40px;
  }
}

@media (prefers-reduced-motion: no-preference) {
  .js .chica,
  .js .alta {
    clip-path: inset(100% 0 0 0);
  }
  .js .cuerpo {
    opacity: 0;
  }
}
</style>
