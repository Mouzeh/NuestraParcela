<script setup lang="ts">
// Titular cuyas líneas suben desde detrás de su línea base al cargar (GSAP).
// Cada línea se escribe aparte porque los titulares son de dos líneas como máximo.
const props = withDefaults(defineProps<{ lineas: string[]; etiqueta?: 'h1' | 'h2'; retraso?: number }>(), {
  etiqueta: 'h2',
  retraso: 0.15,
})

const raiz = ref<HTMLElement>()
useAnimacion(raiz, ({ gsap, raiz }) => {
  // y: 0 anula el translateY inicial del CSS, que GSAP leería como píxeles.
  gsap.fromTo(raiz.querySelectorAll('.texto'), { y: 0, yPercent: 108 }, { y: 0, yPercent: 0, duration: 1.3, stagger: 0.12, delay: props.retraso })
})
</script>

<template>
  <component :is="etiqueta" ref="raiz" class="lineas">
    <span v-for="(l, i) in lineas" :key="l" class="linea" :class="`linea-${i + 1}`">
      <span class="texto">{{ l }}</span>
    </span>
    <slot />
  </component>
</template>

<style scoped>
.linea {
  display: block;
  overflow: hidden;
  padding-bottom: 0.1em;
  margin-bottom: -0.1em;
}
.texto {
  display: block;
}
@media (prefers-reduced-motion: no-preference) {
  .js .texto {
    transform: translateY(108%);
  }
}
</style>
