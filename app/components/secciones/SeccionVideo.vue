<script setup lang="ts">
import { sitio } from '~~/data/sitio'

// Fachada liviana: el reproductor de YouTube solo se carga al presionar play.
const reproducir = ref(false)
</script>

<template>
  <section v-if="sitio.videoYoutubeId" class="video">
    <div class="marco" v-revelar>
      <iframe
        v-if="reproducir"
        :src="`https://www.youtube-nocookie.com/embed/${sitio.videoYoutubeId}?autoplay=1&rel=0`"
        title="Recorrido por las parcelas"
        allow="autoplay; encrypted-media; picture-in-picture"
        allowfullscreen
      />
      <button v-else class="portada" aria-label="Reproducir video del recorrido" @click="reproducir = true">
        <img :src="`https://i.ytimg.com/vi/${sitio.videoYoutubeId}/maxresdefault.jpg`" alt="" loading="lazy" />
        <span class="play"><Icono nombre="play" /></span>
        <span class="texto">Recorre el terreno en video</span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.video {
  margin-top: var(--entre-secciones);
}
.marco {
  aspect-ratio: 16 / 9;
  max-height: 100svh;
  width: 100%;
  background: var(--bosque);
}
iframe,
.portada {
  width: 100%;
  height: 100%;
  border: 0;
}
.portada {
  position: relative;
  padding: 0;
  color: var(--papel);
  background: none;
}
.portada img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.7);
}
.play {
  position: absolute;
  inset: 50% auto auto 50%;
  translate: -50% -50%;
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: var(--acento);
  display: grid;
  place-items: center;
  transition: transform 0.25s var(--facil);
}
.portada:hover .play {
  transform: scale(1.08);
}
.play svg {
  width: 34px;
  height: 34px;
  margin-left: 4px;
}
.texto {
  position: absolute;
  left: var(--margen);
  bottom: 24px;
  font-size: var(--paso-lead);
}
</style>
