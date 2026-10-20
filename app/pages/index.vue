<script setup lang="ts">
import { sitio } from '~~/data/sitio'
import { centroProyecto, disponibles } from '~~/data/lotes'
import { preguntas } from '~~/data/preguntas'

const titulo = 'Parcelas en Los Ángeles con rol propio | Nuestra Parcela'
const descripcion =
  'Parcelas desde 5.000 m² al oriente de Los Ángeles con rol propio, escritura inmediata, electricidad, fibra óptica y portón de acceso. Trato directo con el dueño, desde $32.000.000.'

useSeoMeta({
  title: titulo,
  description: descripcion,
  ogTitle: titulo,
  ogDescription: descripcion,
  ogType: 'website',
  ogUrl: sitio.dominio,
  ogImage: `${sitio.dominio}/img/og.jpg`,
  ogLocale: 'es_CL',
  twitterCard: 'summary_large_image',
})

useHead({
  link: [{ rel: 'canonical', href: sitio.dominio }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify([
        {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: 'Parcela desde 5.000 m² con rol propio en Los Ángeles',
          description: descripcion,
          image: `${sitio.dominio}/img/foto1.webp`,
          brand: { '@type': 'Brand', name: sitio.nombre },
          offers: {
            '@type': 'Offer',
            price: sitio.precio,
            priceCurrency: 'CLP',
            availability: disponibles.length ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
            url: sitio.dominio,
          },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'Place',
          name: sitio.nombre,
          address: { '@type': 'PostalAddress', addressLocality: 'Los Ángeles', addressRegion: 'Biobío', addressCountry: 'CL' },
          geo: { '@type': 'GeoCoordinates', latitude: centroProyecto[0], longitude: centroProyecto[1] },
        },
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: preguntas.map((p) => ({
            '@type': 'Question',
            name: p.pregunta,
            acceptedAnswer: { '@type': 'Answer', text: p.respuesta },
          })),
        },
      ]),
    },
  ],
})
</script>

<template>
  <div>
    <SiteHeader />
    <main>
      <SeccionHeroVideo v-if="sitio.heroVideo" />
      <SeccionHero v-else />
      <SeccionCifra />
      <SeccionPlano />
      <SeccionTerreno />
      <SeccionVideo />
      <SeccionIncluye />
      <SeccionUbicacion />
      <SeccionPrecio />
      <SeccionAgenda />
      <SeccionPreguntas />
    </main>
    <SiteFooter />
    <BotonWhatsapp />
    <VisorFotos />
  </div>
</template>
