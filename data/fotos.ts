// Fotos del terreno. `n` corresponde a /img/foto{n}.webp y /img/foto{n}-sm.webp.
export interface Foto {
  n: number
  w: number
  h: number
  alt: string
}

export const fotos: Foto[] = [
  { n: 1, w: 1200, h: 1200, alt: 'Arboleda y pradera en una de las parcelas' },
  { n: 3, w: 1600, h: 1200, alt: 'Pradera abierta con álamos al fondo' },
  { n: 14, w: 1600, h: 899, alt: 'Campo verde con un árbol y un perro descansando' },
  { n: 7, w: 1200, h: 1200, alt: 'Hilera de álamos junto al camino interior' },
  { n: 6, w: 1200, h: 1600, alt: 'Camino de servidumbre con postación eléctrica' },
  { n: 2, w: 900, h: 1600, alt: 'Árbol con frutos rojos dentro del proyecto' },
  { n: 4, w: 1600, h: 899, alt: 'Árbol solitario en medio de la pradera' },
  { n: 5, w: 1200, h: 1600, alt: 'Poste de luz y árboles con sol de tarde' },
  { n: 10, w: 384, h: 512, alt: 'Pradera con árboles al fondo' },
  { n: 11, w: 384, h: 512, alt: 'Cerco y camino de acceso' },
  { n: 8, w: 384, h: 512, alt: 'Pradera de pasto alto y cielo despejado' },
  { n: 9, w: 512, h: 384, alt: 'Vista amplia del terreno' },
]

export const foto = (n: number) => fotos.find((f) => f.n === n)!
