<script setup lang="ts">
import { estados } from '~~/data/sitio'
import { lotes, servidumbre, centroide, type Lote } from '~~/data/lotes'

// Mapa satelital de Google (Maps JavaScript API). Si la clave falla, avisa con `falla`
// y la sección vuelve al mapa de Esri.
const props = defineProps<{ seleccion: number; clave: string }>()
const emit = defineEmits<{ elegir: [lote: Lote]; falla: [] }>()

const contenedor = ref<HTMLDivElement>()
let mapa: any = null
const poligonos = new Map<number, any>()
const etiquetas = new Map<number, HTMLElement>()

const cargarGoogle = (clave: string) =>
  new Promise<any>((resolver, rechazar) => {
    const w = window as any
    if (w.google?.maps) return resolver(w.google)
    w.__npGoogle = () => resolver(w.google)
    w.gm_authFailure = () => emit('falla')
    const s = document.createElement('script')
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(clave)}&v=weekly&language=es&region=CL&callback=__npGoogle`
    s.async = true
    s.onerror = rechazar
    document.head.append(s)
  })

const estiloGoogle = (activo: boolean) => {
  const e = estiloPoligono(activo)
  return { strokeColor: e.color, strokeWeight: e.weight, fillColor: e.fillColor, fillOpacity: e.fillOpacity }
}

onMounted(async () => {
  let google: any
  try {
    google = await cargarGoogle(props.clave)
  } catch {
    return emit('falla')
  }
  const g = google.maps
  mapa = new g.Map(contenedor.value!, {
    mapTypeId: 'satellite',
    tilt: 0,
    disableDefaultUI: true,
    zoomControl: true,
    fullscreenControl: true,
    gestureHandling: 'cooperative',
    clickableIcons: false,
  })

  new g.Polyline({ map: mapa, path: servidumbre.map(([lat, lng]) => ({ lat, lng })), strokeColor: estiloMapa.servidumbre, strokeWeight: 5 })

  // Etiquetas HTML sobre el mapa, sin depender de un Map ID.
  class Etiqueta extends g.OverlayView {
    constructor(
      private pos: any,
      private el: HTMLElement,
    ) {
      super()
    }
    onAdd() {
      this.getPanes().overlayMouseTarget.append(this.el)
    }
    draw() {
      const p = this.getProjection().fromLatLngToDivPixel(this.pos)
      this.el.style.cssText = `position:absolute;left:${p.x}px;top:${p.y}px;transform:translate(-50%,-50%)`
    }
    onRemove() {
      this.el.remove()
    }
  }

  const limites = new g.LatLngBounds()
  for (const l of lotes) {
    const path = l.coords.map(([lat, lng]) => ({ lat, lng }))
    path.forEach((p) => limites.extend(p))
    const p = new g.Polygon({ map: mapa, paths: path, ...estiloGoogle(l.numero === props.seleccion) })
    p.addListener('click', () => emit('elegir', l))
    poligonos.set(l.numero, p)

    const el = document.createElement('button')
    el.type = 'button'
    el.className = 'boton-etiqueta'
    el.setAttribute('aria-label', `Parcela ${l.numero}, ${estados[l.estado]}`)
    el.innerHTML = htmlEtiqueta(l, l.numero === props.seleccion)
    el.addEventListener('click', () => emit('elegir', l))
    const [lat, lng] = centroide(l.coords)
    new Etiqueta(new g.LatLng(lat, lng), el).setMap(mapa)
    etiquetas.set(l.numero, el)
  }
  mapa.addListener('zoom_changed', () => contenedor.value?.style.setProperty('--tam-etiqueta', `${tamEtiqueta(mapa.getZoom())}px`))
  mapa.fitBounds(limites, 20)
})

watch(
  () => props.seleccion,
  (n) => {
    for (const l of lotes) {
      const activo = l.numero === n
      poligonos.get(l.numero)?.setOptions(estiloGoogle(activo))
      const el = etiquetas.get(l.numero)
      if (el) el.innerHTML = htmlEtiqueta(l, activo)
    }
    const l = lotes.find((x) => x.numero === n)
    if (l && mapa) {
      const [lat, lng] = centroide(l.coords)
      mapa.panTo({ lat, lng })
    }
  },
)
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
.mapa :deep(.boton-etiqueta) {
  padding: 0;
  border: 0;
  background: none;
}
@media (max-width: 560px) {
  .mapa {
    height: 78svh;
    min-height: 460px;
  }
}
</style>
