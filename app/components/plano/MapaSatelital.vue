<script setup lang="ts">
import type { Map as MapaLeaflet, Polygon, Marker } from 'leaflet'
import { estados } from '~~/data/sitio'
import { lotes, servidumbre, centroide, type Lote } from '~~/data/lotes'

// Mapa satelital con imágenes de Esri (sin clave). Se usa cuando no hay clave de Google Maps.
const props = defineProps<{ seleccion: number }>()
const emit = defineEmits<{ elegir: [lote: Lote] }>()

const contenedor = ref<HTMLDivElement>()
let mapa: MapaLeaflet | null = null
const poligonos = new Map<number, Polygon>()
const etiquetas = new Map<number, Marker>()

onMounted(async () => {
  const L = await import('leaflet')
  mapa = L.map(contenedor.value!, { scrollWheelZoom: false, attributionControl: true, maxZoom: 19, zoomSnap: 0.25 })
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxNativeZoom: 18,
    maxZoom: 19,
    attribution: 'Imágenes © Esri, Maxar, Earthstar Geographics',
  }).addTo(mapa)

  L.polyline(servidumbre, { color: estiloMapa.servidumbre, weight: 5, opacity: 0.9 })
    .bindTooltip('Servidumbre de tránsito 6 m')
    .addTo(mapa)

  for (const l of lotes) {
    const activo = l.numero === props.seleccion
    const p = L.polygon(l.coords, estiloPoligono(activo))
      .on('click', () => emit('elegir', l))
      .addTo(mapa)
    poligonos.set(l.numero, p)
    const icono = (a: boolean) => L.divIcon({ html: htmlEtiqueta(l, a), className: '', iconSize: [0, 0] })
    const m = L.marker(centroide(l.coords), { icon: icono(activo), title: `Parcela ${l.numero} · ${estados[l.estado]}`, keyboard: true })
      .on('click', () => emit('elegir', l))
      .addTo(mapa)
    ;(m as any).icono = icono
    etiquetas.set(l.numero, m)
  }
  // Los círculos se achican al alejarse para no taparse entre sí.
  const ajustarEtiquetas = () => contenedor.value?.style.setProperty('--tam-etiqueta', `${tamEtiqueta(mapa!.getZoom())}px`)
  mapa.on('zoomend', ajustarEtiquetas)
  const encuadrar = () => {
    mapa!.invalidateSize()
    mapa!.fitBounds(L.featureGroup([...poligonos.values()]).getBounds(), { padding: [20, 20] })
    ajustarEtiquetas()
  }
  encuadrar()
  requestAnimationFrame(encuadrar)
})

watch(
  () => props.seleccion,
  (n) => {
    for (const l of lotes) {
      const activo = l.numero === n
      poligonos.get(l.numero)?.setStyle(estiloPoligono(activo))
      const m = etiquetas.get(l.numero) as any
      m?.setIcon(m.icono(activo))
    }
    const p = poligonos.get(n)
    if (p && mapa) mapa.panTo(p.getBounds().getCenter())
  },
)

onBeforeUnmount(() => mapa?.remove())
</script>

<template>
  <div ref="contenedor" class="mapa" aria-label="Mapa satelital de las parcelas" />
</template>

<style scoped>
.mapa {
  flex: 1;
  height: min(86svh, 900px);
  min-height: 560px;
  background: var(--bosque-2);
}
@media (max-width: 560px) {
  .mapa {
    height: 78svh;
    min-height: 460px;
  }
}
</style>
