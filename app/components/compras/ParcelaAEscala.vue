<script setup lang="ts">
import { gsap } from 'gsap'
import { lotes } from '~~/data/lotes'

// La parcela 6 mide exactamente 5.000 m² en el plano: se dibuja a escala real (1 unidad = 1 m)
// y encima se superpone, a la misma escala, algo conocido para comparar.
const lote = lotes.find((l) => l.numero === 6)!

const lat0 = lote.coords.reduce((s, p) => s + p[0], 0) / lote.coords.length
const lon0 = lote.coords.reduce((s, p) => s + p[1], 0) / lote.coords.length
const kx = 111320 * Math.cos((lat0 * Math.PI) / 180)
const ky = 110540
const pts = lote.coords.map(([lat, lon]) => [(lon - lon0) * kx, (lat0 - lat) * ky] as [number, number])

const pad = 34
const minX = Math.min(...pts.map((p) => p[0])) - pad
const minY = Math.min(...pts.map((p) => p[1])) - pad
const ancho = Math.max(...pts.map((p) => p[0])) - minX + pad
const alto = Math.max(...pts.map((p) => p[1])) - minY + pad
const contorno = pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' ')

// Medidas de cada lado, ubicadas en el punto medio y empujadas hacia afuera.
const lados = pts.map((a, i) => {
  const b = pts[(i + 1) % pts.length]!
  const mx = (a[0] + b[0]) / 2
  const my = (a[1] + b[1]) / 2
  const dx = b[0] - a[0]
  const dy = b[1] - a[1]
  const largo = Math.hypot(dx, dy)
  let ang = (Math.atan2(dy, dx) * 180) / Math.PI
  if (ang > 90) ang -= 180
  if (ang < -90) ang += 180
  const n = [-dy / largo, dx / largo]
  const sentido = n[0]! * mx + n[1]! * my > 0 ? 1 : -1
  return { x: mx + n[0]! * 11 * sentido, y: my + n[1]! * 11 * sentido, ang, texto: `${(lote.lados[i] ?? largo).toLocaleString('es-CL')} m` }
})

// Eje largo del lote: las figuras de comparación se alinean con él.
const iLargo = pts.reduce((m, a, i) => {
  const b = pts[(i + 1) % pts.length]!
  return Math.hypot(b[0] - a[0], b[1] - a[1]) > m.l ? { i, l: Math.hypot(b[0] - a[0], b[1] - a[1]) } : m
}, { i: 0, l: 0 }).i
const a = pts[iLargo]!
const b = pts[(iLargo + 1) % pts.length]!
const angulo = (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI + 90

const comparaciones = [
  {
    id: 'cancha',
    nombre: 'Cancha de fútbol',
    w: 68,
    h: 105,
    texto: 'Una cancha profesional mide 105 × 68 m. Tu parcela equivale al 70 % de una cancha.',
  },
  {
    id: 'casa',
    nombre: 'Casa de 140 m²',
    w: 10,
    h: 14,
    texto: 'Una casa de un piso de 10 × 14 m ocupa menos del 3 % del terreno. El resto es jardín, huerto y árboles.',
  },
  {
    id: 'tenis',
    nombre: 'Cancha de tenis',
    w: 10.97,
    h: 23.77,
    texto: 'En media hectárea caben 19 canchas de tenis. O una, con todo el espacio alrededor.',
  },
]
const elegida = ref(comparaciones[0]!)

const raiz = ref<HTMLElement>()
useAnimacion(raiz, ({ gsap, raiz }) => {
  const linea = raiz.querySelector<SVGPolygonElement>('.contorno')!
  const largo = linea.getTotalLength()
  gsap
    .timeline({ scrollTrigger: { trigger: raiz.querySelector('svg'), start: 'top 75%', once: true } })
    .fromTo(linea, { strokeDasharray: largo, strokeDashoffset: largo }, { strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut' })
    .fromTo(raiz.querySelector('.relleno'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1 }, '-=0.8')
    .fromTo(raiz.querySelectorAll('.medida'), { autoAlpha: 0 }, { autoAlpha: 1, stagger: 0.12, duration: 0.6 }, '-=0.6')
    .fromTo(raiz.querySelector('.figura'), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, transformOrigin: 'center', duration: 0.9 }, '-=0.3')
})

// Al cambiar de comparación, la figura nueva crece desde el centro.
const figura = ref<SVGGElement>()
watch(elegida, async () => {
  await nextTick()
  if (!figura.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  gsap.fromTo(figura.value, { scale: 0.5, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, transformOrigin: 'center', duration: 0.8 })
})
</script>

<template>
  <div ref="raiz" class="escala contenedor">
    <div class="texto">
      <h2 v-revelar>Media hectárea, a escala</h2>
      <p class="bajada" v-revelar="1">
        La parcela 6 mide exactamente {{ lote.superficie.toLocaleString('es-CL') }}&nbsp;m² según el plano. Compárala con algo que conoces.
      </p>
      <div class="opciones" role="group" aria-label="Comparar con" v-revelar="2">
        <button v-for="c in comparaciones" :key="c.id" :aria-pressed="elegida.id === c.id" @click="elegida = c">{{ c.nombre }}</button>
      </div>
      <p class="resultado" aria-live="polite">{{ elegida.texto }}</p>
    </div>

    <figure class="dibujo">
      <svg :viewBox="`${minX.toFixed(1)} ${minY.toFixed(1)} ${ancho.toFixed(1)} ${alto.toFixed(1)}`" role="img" :aria-label="`Contorno de la parcela 6, ${lote.superficie} m², comparada con: ${elegida.nombre}`">
        <polygon :points="contorno" class="relleno" />
        <g ref="figura" :key="elegida.id" class="figura" :transform="`rotate(${angulo.toFixed(1)})`">
          <rect :x="-elegida.w / 2" :y="-elegida.h / 2" :width="elegida.w" :height="elegida.h" />
          <template v-if="elegida.id === 'cancha'">
            <line :x1="-elegida.w / 2" y1="0" :x2="elegida.w / 2" y2="0" />
            <circle r="9.15" />
          </template>
          <line v-if="elegida.id === 'tenis'" :x1="-elegida.w / 2" y1="0" :x2="elegida.w / 2" y2="0" />
        </g>
        <polygon :points="contorno" class="contorno" />
        <text v-for="(l, i) in lados" :key="i" class="medida" :transform="`translate(${l.x.toFixed(1)} ${l.y.toFixed(1)}) rotate(${l.ang.toFixed(1)})`">
          {{ l.texto }}
        </text>
        <g :transform="`translate(${(minX + 8).toFixed(1)} ${(minY + alto - 10).toFixed(1)})`" class="escala-barra">
          <rect width="20" height="2.4" />
          <text x="24" y="2.6">20 m</text>
        </g>
      </svg>
      <figcaption>Parcela 6 · {{ lote.superficie.toLocaleString('es-CL') }} m² · dibujo a escala desde el plano georreferenciado</figcaption>
    </figure>
  </div>
</template>

<style scoped>
.escala {
  display: grid;
  grid-template-columns: 5fr 7fr;
  gap: clamp(32px, 6vw, 96px);
  align-items: center;
  margin-top: var(--entre-secciones);
}
.bajada {
  margin-top: 20px;
  font-size: var(--paso-lead);
  line-height: 1.35;
  max-width: 32ch;
}
.opciones {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 32px;
}
.opciones button {
  min-height: 44px;
  padding: 0 18px;
  border: 0;
  background: var(--superficie);
  transition:
    background-color 0.2s,
    transform 0.15s var(--facil);
}
.opciones button:hover {
  background: #d3d8cc;
}
.opciones button:active {
  transform: scale(0.97);
}
.opciones button[aria-pressed='true'] {
  background: var(--bosque);
  color: var(--papel);
}
.resultado {
  margin-top: 20px;
  max-width: 40ch;
  min-height: 3.2em;
}
.dibujo {
  margin: 0;
  background: var(--superficie);
  padding: clamp(16px, 3vw, 40px);
}
svg {
  display: block;
  width: 100%;
  height: auto;
  max-height: 72svh;
  font-family: var(--serif);
  overflow: visible;
}
.relleno {
  fill: #c4d7ad;
}
.contorno {
  fill: none;
  stroke: var(--bosque);
  stroke-width: 1.2;
  stroke-linejoin: round;
}
.figura rect,
.figura line,
.figura circle {
  fill: none;
  stroke: #8a4c31;
  stroke-width: 0.8;
  stroke-dasharray: 2.5 1.6;
}
.figura rect {
  fill: rgba(138, 76, 49, 0.12);
}
.medida {
  font-size: 5.2px;
  fill: var(--tinta);
  text-anchor: middle;
  dominant-baseline: central;
}
.escala-barra rect {
  fill: var(--tinta);
}
.escala-barra text {
  font-size: 5px;
  fill: var(--tinta);
}
figcaption {
  margin-top: 12px;
  font-size: var(--paso-chico);
  color: var(--tinta-suave);
}
@media (max-width: 900px) {
  .escala {
    grid-template-columns: 1fr;
  }
  .dibujo {
    margin: 0 calc(var(--margen) * -1);
    padding: 12px;
  }
  .medida {
    font-size: 8px;
  }
  .escala-barra text {
    font-size: 7px;
  }
  .bajada {
    font-size: var(--paso-cuerpo);
  }
}
</style>
