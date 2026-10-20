<script setup lang="ts">
import { sitio } from '~~/data/sitio'
import { centroProyecto } from '~~/data/lotes'
import { cercanos, panoramas } from '~~/data/entorno'

const [lat, lon] = centroProyecto
const mapaEmbed = `https://maps.google.com/maps?q=${lat.toFixed(6)},${lon.toFixed(6)}&z=11&output=embed`
const raiz = ref<HTMLElement>()
useAnimacion(raiz, ({ gsap, raiz }) => {
  const hoja = raiz.querySelector('.hoja')
  gsap.fromTo(hoja, { y: 120, rotate: 2 }, { y: 0, rotate: 0, duration: 1.6, scrollTrigger: { trigger: raiz, start: 'top 75%', once: true } })
  gsap.fromTo(
    raiz.querySelectorAll('.hoja li'),
    { autoAlpha: 0, x: -16 },
    { autoAlpha: 1, x: 0, stagger: 0.06, delay: 0.4, scrollTrigger: { trigger: hoja, start: 'top 70%', once: true } },
  )
})
const comoLlegar = `https://www.google.com/maps/dir/?api=1&destination=${lat.toFixed(6)},${lon.toFixed(6)}`
</script>

<template>
  <section id="ubicacion" ref="raiz" class="ubicacion">
    <div class="mapa">
      <iframe :src="mapaEmbed" title="Mapa de ubicación de Nuestra Parcela" loading="lazy" referrerpolicy="no-referrer-when-downgrade" />
    </div>
    <div class="contenedor capa">
      <article class="hoja">
        <h2>El Aromo, Los Ángeles</h2>
        <p class="nota">{{ sitio.ruta }}, al oriente de la ciudad, camino a la precordillera. Acceso por el {{ sitio.acceso.charAt(0).toLowerCase() + sitio.acceso.slice(1) }}.</p>

        <h3>Para el día a día</h3>
        <ul>
          <li v-for="c in cercanos" :key="c.nombre">
            <div>
              <p class="nombre">{{ c.nombre }}</p>
              <p v-if="c.detalle" class="detalle">{{ c.detalle }}</p>
            </div>
            <p class="tiempo">{{ c.tiempo }}</p>
          </li>
        </ul>

        <h3>A pasos de la precordillera</h3>
        <ul>
          <li v-for="p in panoramas" :key="p.nombre">
            <img :src="`/img/turismo/${p.img}.webp`" :alt="p.nombre" loading="lazy" width="56" height="56" />
            <div>
              <p class="nombre">{{ p.nombre }}</p>
              <p class="detalle">{{ p.detalle }}</p>
            </div>
            <p class="tiempo">{{ p.tiempo }}</p>
          </li>
        </ul>

        <div class="cierre">
          <p>Tiempos aproximados en auto desde el proyecto.</p>
          <a :href="comoLlegar" target="_blank" rel="noopener" class="boton"><Icono nombre="ubicacion" /> Cómo llegar</a>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
.ubicacion {
  position: relative;
  margin-top: var(--entre-secciones);
  background: var(--superficie);
}
.mapa {
  position: absolute;
  inset: 0;
}
.mapa iframe {
  width: 100%;
  height: 100%;
  border: 0;
  filter: saturate(0.7);
}
.capa {
  position: relative;
  display: flex;
  justify-content: flex-end;
  padding-top: 120px;
  padding-bottom: 120px;
  pointer-events: none;
}
.hoja {
  --r: 9px;
  pointer-events: auto;
  width: min(100%, 620px);
  background: var(--papel);
  padding: 72px clamp(28px, 5vw, 64px) 64px;
  text-align: center;
  /* Bordes festoneados arriba y abajo, como una tarjeta impresa. */
  mask:
    radial-gradient(var(--r) at 50% 0, #0000 97%, #000) 50% 0 / calc(var(--r) * 2) 51% repeat-x, /* taste-skill-ignore */
    radial-gradient(var(--r) at 50% 100%, #0000 97%, #000) 50% 100% / calc(var(--r) * 2) 51% repeat-x; /* taste-skill-ignore */
}
h2 {
  font-size: var(--paso-titulo);
}
.nota {
  margin: 12px auto 0;
  max-width: 40ch;
  color: var(--tinta-suave);
}
h3 {
  font-size: var(--paso-lead);
  margin-top: 56px;
  margin-bottom: 20px;
}
ul {
  list-style: none;
  margin: 0 auto;
  padding: 0;
  max-width: 440px;
  display: grid;
  gap: 16px;
  text-align: left;
}
li {
  display: flex;
  align-items: center;
  gap: 16px;
}
li img {
  width: 56px;
  height: 56px;
  object-fit: cover;
  flex: none;
}
li > div {
  flex: 1;
  min-width: 0;
}
.detalle {
  font-size: var(--paso-chico);
  color: var(--tinta-suave);
}
.tiempo {
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
.cierre {
  margin-top: 56px;
  display: grid;
  justify-items: center;
  gap: 16px;
  color: var(--tinta-suave);
  font-size: var(--paso-chico);
}
@media (max-width: 720px) {
  .mapa {
    position: relative;
    height: 60svh;
  }
  .capa {
    padding: 0 10px 64px;
    margin-top: -80px;
  }
  .hoja {
    padding: 48px 24px 48px;
  }
}
</style>
