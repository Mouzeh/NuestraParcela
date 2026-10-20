// Datos editables del proyecto. Cambia aquí precios, contacto y video.
export const sitio = {
  nombre: 'Nuestra Parcela',
  dominio: 'https://nuestraparcela.cl',
  ubicacion: 'El Aromo, Los Ángeles, Región del Biobío',
  acceso: 'Camino público Tucapel – Pedregal',
  whatsapp: '56995479174',
  whatsappVisible: '+56 9 9547 9174',
  email: 'contacto@nuestraparcela.cl',
  precio: 32000000,
  superficieBase: 5000,
  hectareasTotales: 9.5,
  ruta: 'Km 23,3 de la Ruta Q-35',
  minutosLosAngeles: 25,
  // Video de dron para la portada (MP4 en /public/video, 15–30 s, sin audio, idealmente < 10 MB).
  // Vacío = la portada muestra las fotos.
  heroVideo: '/video/terreno.mp4',
  heroPoster: '/img/terreno-poster.jpg',
  // Provisorio: recorrido armado con fotos del terreno. Cambiar a "Vuelo de dron sobre las parcelas" al reemplazar el video.
  heroVideoDescripcion: 'Recorrido por las praderas y arboledas del terreno',
  // ID de YouTube del recorrido (ej. 'dQw4w9WgXcQ'). Vacío = la sección de video no se muestra.
  videoYoutubeId: '',
  planoPdf: 'https://drive.google.com/file/d/1UkjA0r8W97mdW_9GneNrwKbVgoeKTsMg/view?usp=sharing',
  planoKml: 'https://drive.google.com/uc?export=download&id=1RGp2AmyViypZDVCA6uJ-njnZOaLOleOB',
}

export type EstadoLote = 'disponible' | 'reservada' | 'vendida'

export const estados: Record<EstadoLote, string> = {
  disponible: 'Disponible',
  reservada: 'Reservada',
  vendida: 'Vendida',
}

export const clp = (n: number) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n)

export const waLink = (texto: string) =>
  `https://wa.me/${sitio.whatsapp}?text=${encodeURIComponent(texto)}`
