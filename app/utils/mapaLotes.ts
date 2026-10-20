import type { Lote } from '~~/data/lotes'

// Estilo compartido por los mapas satelitales (Google y Esri):
// deslindes blancos, un círculo numerado por lote y la servidumbre en color tierra.
export const estiloMapa = {
  borde: '#ffffff',
  relleno: '#ffffff',
  servidumbre: '#e6d6b0',
  aro: { disponible: '#ffffff', reservada: '#f0b93b', vendida: '#e0443a' },
}

export const estiloPoligono = (activo: boolean) => ({
  color: estiloMapa.borde,
  weight: activo ? 3 : 1.6,
  dashArray: activo ? undefined : '6 5',
  fillColor: estiloMapa.relleno,
  fillOpacity: activo ? 0.28 : 0.04,
})

// Diámetro del círculo según el zoom: 30 px a zoom 17, más chico al alejarse.
export const tamEtiqueta = (zoom: number) => Math.round(Math.min(34, Math.max(18, 30 * 2 ** ((zoom - 17) * 0.8))))

// Círculo numerado del lote, como HTML para usarlo de marcador en cualquiera de los dos mapas.
export const htmlEtiqueta = (l: Lote, activo: boolean) =>
  `<span class="etiqueta-lote ${l.estado}${activo ? ' activa' : ''}" style="--aro:${estiloMapa.aro[l.estado]}">${l.numero}</span>`
