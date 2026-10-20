<script setup lang="ts">
import { estados } from '~~/data/sitio'
import { lotes, servidumbre, centroide, referencias, type Lote } from '~~/data/lotes'

defineProps<{ seleccion: number }>()
const emit = defineEmits<{ elegir: [lote: Lote] }>()

// Proyección local en metros (1 unidad = 1 m), rotada 90° (norte a la izquierda) para que el
// proyecto, que es largo de norte a sur, quepa a lo ancho de la pantalla.
const todos = lotes.flatMap((l) => l.coords).concat(servidumbre)
const lat0 = todos.reduce((s, p) => s + p[0], 0) / todos.length
const kx = 111320 * Math.cos((lat0 * Math.PI) / 180)
const ky = 110540
const latMax = Math.max(...todos.map((p) => p[0]))
const lonMax = Math.max(...todos.map((p) => p[1]))
const margen = 30
const proyectar = ([lat, lon]: [number, number]) => [(latMax - lat) * ky + margen, (lonMax - lon) * kx + margen] as [number, number]
const proyectados = todos.map(proyectar)
const ancho = Math.ceil(Math.max(...proyectados.map((p) => p[0]))) + margen
const alto = Math.ceil(Math.max(...proyectados.map((p) => p[1]))) + margen

const puntos = (c: [number, number][]) => c.map((p) => proyectar(p).map((v) => v.toFixed(1)).join(',')).join(' ')
// Verdes levemente distintos para que el plano se lea como un loteo ilustrado.
const verdes = ['#b9cfa2', '#c4d7ad', '#aec694', '#bfd2a6']
const formas = lotes.map((l, i) => {
  const [x, y] = proyectar(centroide(l.coords))
  return { lote: l, puntos: puntos(l.coords), x, y, verde: verdes[i % verdes.length] }
})
const caminoD = 'M' + servidumbre.map((p) => proyectar(p).map((v) => v.toFixed(1)).join(' ')).join(' L')
const acceso = proyectar(servidumbre[0]!)
const estero = proyectar(referencias.estero)
const publico = proyectar(referencias.caminoPublico)
</script>

<template>
  <div class="desliza">
    <p class="pista">Desliza para recorrer el plano completo →</p>
    <svg :viewBox="`0 0 ${ancho} ${alto}`" role="group" :aria-label="`Plano de las ${lotes.length} parcelas`">
      <!-- Cerco vivo: un borde ancho bajo todos los lotes dibuja el contorno del predio. -->
      <polygon v-for="f in formas" :key="`c${f.lote.numero}`" :points="f.puntos" class="cerco" />
      <g v-for="f in formas" :key="f.lote.numero">
        <polygon
          :points="f.puntos"
          class="lote"
          :class="[f.lote.estado, { activo: seleccion === f.lote.numero }]"
          :style="{ '--verde': f.verde }"
          tabindex="0"
          role="button"
          :aria-pressed="seleccion === f.lote.numero"
          :aria-label="`Parcela ${f.lote.numero}, ${f.lote.superficie.toLocaleString('es-CL')} m², ${estados[f.lote.estado]}`"
          @click="emit('elegir', f.lote)"
          @keydown.enter.space.prevent="emit('elegir', f.lote)"
        />
        <g class="rotulo-lote" :class="{ activo: seleccion === f.lote.numero }" :transform="`translate(${f.x.toFixed(1)} ${f.y.toFixed(1)})`">
          <text class="numero" y="5">{{ f.lote.numero }}</text>
          <text class="m2" transform="translate(0 30) rotate(-90)">{{ f.lote.superficie.toLocaleString('es-CL') }} m²</text>
        </g>
      </g>

      <!-- Servidumbre de tránsito: dibujada a su ancho real de 6 m. -->
      <path :d="caminoD" class="calzada-borde" />
      <path id="servidumbre" :d="caminoD" class="calzada" />
      <text class="rotulo-camino">
        <textPath href="#servidumbre" startOffset="38%">Servidumbre de tránsito 6 m</textPath>
      </text>

      <g :transform="`translate(${acceso[0].toFixed(1)} ${acceso[1].toFixed(1)})`" class="acceso">
        <path d="M0 6 L-6 16 L6 16 Z" />
        <text y="28">Acceso</text>
      </g>
      <text :x="ancho - 8" :y="Math.min(publico[1] + 40, alto - 8)" class="rotulo" text-anchor="end">Camino público Tucapel – Pedregal →</text>
      <text :x="estero[0]" :y="Math.min(estero[1] + 70, alto - 8)" class="rotulo agua">Estero Patahuenco</text>

      <g :transform="`translate(${margen - 20}, ${alto - 22})`" class="norte">
        <path d="M0 0 L16 -7 L16 7 Z" />
        <text x="22" y="5">N</text>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.pista {
  display: none;
}
.desliza {
  overflow-x: auto;
  padding: clamp(12px, 2vw, 28px);
  flex: 1;
  display: flex;
  align-items: center;
  background: #e3e8db;
}
svg {
  width: 100%;
  min-width: 620px;
  height: auto;
  display: block;
  font-family: var(--serif);
}
.cerco {
  fill: none;
  stroke: #7f9c6a;
  stroke-width: 7;
  stroke-linejoin: round;
}
.lote {
  fill: var(--verde);
  stroke: #f4f6ef;
  stroke-width: 1.6;
  stroke-linejoin: round;
  cursor: pointer;
  outline: none;
  transition:
    fill 0.25s,
    filter 0.25s;
}
.lote:hover,
.lote:focus-visible {
  fill: #9dbb84;
}
.lote:focus-visible {
  stroke: var(--acento);
  stroke-width: 3;
}
.lote.reservada {
  fill: #e5cf94;
}
.lote.vendida {
  fill: #cfd1ca;
  cursor: default;
}
.lote.activo {
  fill: var(--acento);
}
.rotulo-lote {
  pointer-events: none;
  text-anchor: middle;
  fill: #2f4a33;
}
.rotulo-lote.activo {
  fill: var(--papel);
}
.numero {
  font-size: 15px;
  font-weight: 500;
}
.m2 {
  font-size: 8px;
  dominant-baseline: central;
  text-anchor: middle;
}
.calzada-borde {
  fill: none;
  stroke: #c9b994;
  stroke-width: 8;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.calzada {
  fill: none;
  stroke: #efe7d3;
  stroke-width: 6;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.rotulo-camino {
  font-size: 4.5px;
  fill: #7a6a48;
  dominant-baseline: central;
}
.acceso path {
  fill: #8a4c31;
}
.acceso text {
  font-size: 9px;
  text-anchor: middle;
  fill: #8a4c31;
}
.rotulo,
.norte text {
  font-size: 10px;
  fill: #4b5a47;
}
.agua {
  font-style: italic;
  fill: #3f6a86;
  text-anchor: middle;
}
.norte path {
  fill: #4b5a47;
}
@media (max-width: 560px) {
  .desliza {
    padding: 8px;
    flex-direction: column;
    align-items: stretch;
  }
  .pista {
    display: block;
    position: sticky;
    left: 0;
    padding: 4px 8px 8px;
    font-size: var(--paso-chico);
    color: var(--tinta-suave);
  }
  svg {
    min-width: 640px;
  }
}
</style>
