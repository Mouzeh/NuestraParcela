// Las versiones de muestra (Vercel sin el dominio nuestraparcela.cl, o vistas previas) responden con
// el encabezado X-Robots-Tag: noindex para que Google no las indexe. Al conectar el dominio real y
// volver a publicar, el encabezado desaparece. NOINDEX=1 fuerza el modo muestra.
const dominioVercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? ''
const esMuestra =
  process.env.NOINDEX === '1' ||
  process.env.VERCEL_ENV === 'preview' ||
  (process.env.VERCEL === '1' && !dominioVercel.includes('nuestraparcela.cl'))

export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  devtools: { enabled: false },
  // Clave de Google Maps (JavaScript API) para el mapa satelital. Se define con la variable de
  // entorno NUXT_PUBLIC_GOOGLE_MAPS_KEY; sin clave, el mapa usa las imágenes de Esri.
  runtimeConfig: { public: { googleMapsKey: '' } },
  css: ['~/assets/css/main.css', 'leaflet/dist/leaflet.css'],
  // Componentes ordenados en carpetas (layout, ui, plano, secciones, agenda)
  // pero usados por su nombre de archivo, sin prefijo de carpeta.
  components: [{ path: '~/components', pathPrefix: false }],
  app: {
    head: {
      htmlAttrs: { lang: 'es-CL' },
      link: [
        { rel: 'icon', type: 'image/png', href: '/apple-touch-icon.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;1,6..72,400&display=swap',
        },
        { rel: 'preload', as: 'image', href: '/img/foto1.webp', fetchpriority: 'high' },
      ],
      // Las animaciones de entrada solo ocultan contenido si hay JavaScript.
      script: [{ innerHTML: "document.documentElement.classList.add('js')" }],
      meta: [{ name: 'theme-color', content: '#23392a' }],
    },
  },
  routeRules: {
    '/': { prerender: true },
    '/img/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    ...(esMuestra ? { '/**': { headers: { 'x-robots-tag': 'noindex, nofollow' } } } : {}),
  },
})
