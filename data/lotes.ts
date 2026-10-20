import crudos from './lotes.json'
import camino from './camino.json'
import { estados, type EstadoLote } from './sitio'

export interface Lote {
  numero: number
  // m² según el cuadro de superficies del plano de subdivisión oficial
  superficie: number
  // m² de servidumbre de tránsito dentro del lote (null si el plano no lo indica)
  servidumbre: number | null
  perimetro: number
  lados: number[]
  coords: [number, number][]
  estado: EstadoLote
  // null = "consultar valor" (p. ej. el lote 2, de 1 ha)
  precio: number | null
}

// Cuadro de superficies del plano oficial ("Plano de subdivisión Lote A y B, Hijuela San Esteban").
// Las coordenadas, perímetros y medidas de lados de lotes.json vienen del KML y son aproximados.
const oficial: Record<number, [superficie: number, servidumbre: number | null]> = {
  1: [5592, 235], 2: [10457, 820], 3: [5015, 289], 4: [5030, 272], 5: [5100, 262], 6: [5000, 268],
  7: [5035, 253], 8: [5785, 287], 9: [5500, 374], 10: [5800, 646], 11: [6800, 1031], 12: [5140, 298],
  13: [5160, 294], 14: [5150, 292], 15: [5150, 293], 16: [5130, 292], 17: [5120, 296], 18: [5120, null],
}

// Para marcar una parcela como reservada o vendida, edita `estado` en lotes.json.
export const lotes: Lote[] = (crudos as any[]).map((l) => {
  const [superficie, servidumbre] = oficial[l.numero]!
  return { ...l, superficie, servidumbre, precio: superficie > 8000 ? null : 32000000 }
})

export const servidumbre = camino as [number, number][]

export const centroide = (c: [number, number][]) => {
  const lat = c.reduce((s, p) => s + p[0], 0) / c.length
  const lon = c.reduce((s, p) => s + p[1], 0) / c.length
  return [lat, lon] as [number, number]
}

export const centroProyecto = centroide(lotes.flatMap((l) => l.coords))

export const disponibles = lotes.filter((l) => l.estado === 'disponible')

export const conteoEstados = (Object.keys(estados) as EstadoLote[]).map((estado) => ({
  estado,
  total: lotes.filter((l) => l.estado === estado).length,
}))

export const hectareas = (m2: number) => (m2 / 10000).toLocaleString('es-CL', { maximumFractionDigits: 2 })

// Puntos de referencia tomados del KML del plano de subdivisión.
export const referencias = {
  estero: [-37.3384743, -72.1294842] as [number, number],
  caminoPublico: [-37.3400124, -72.1291509] as [number, number],
}
