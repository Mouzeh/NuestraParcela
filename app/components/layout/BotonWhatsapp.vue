<script setup lang="ts">
import { waLink } from '~~/data/sitio'

// Aparece después de la portada y se esconde al llegar al pie, que ya tiene el contacto.
const visible = ref(false)
onMounted(() => {
  let enPie = false
  const revisar = () => (visible.value = window.scrollY > window.innerHeight * 0.8 && !enPie)
  const pie = document.querySelector('footer')
  const obs = new IntersectionObserver(([e]) => {
    enPie = e!.isIntersecting
    revisar()
  })
  if (pie) obs.observe(pie)
  revisar()
  window.addEventListener('scroll', revisar, { passive: true })
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', revisar)
    obs.disconnect()
  })
})
</script>

<template>
  <a
    :href="waLink('Hola, vengo desde la web y quiero información sobre las parcelas.')"
    target="_blank"
    rel="noopener"
    class="flotante"
    :class="{ visible }"
    aria-label="Escribir por WhatsApp"
  >
    <Icono nombre="whatsapp" />
  </a>
</template>

<style scoped>
.flotante {
  position: fixed;
  right: 18px;
  bottom: 18px;
  z-index: 40;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: #1f8f4a;
  color: #fff;
  display: grid;
  place-items: center;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22); /* taste-skill-ignore: botón flotante real */
  opacity: 0;
  transform: translateY(16px) scale(0.9);
  pointer-events: none;
  transition:
    opacity 0.3s,
    transform 0.35s var(--facil);
}
.flotante.visible {
  opacity: 1;
  transform: none;
  pointer-events: auto;
}
.flotante.visible:hover {
  transform: scale(1.06);
}
.flotante.visible:active {
  transform: scale(0.95);
}
.flotante svg {
  width: 30px;
  height: 30px;
}
@media (max-width: 560px) {
  .flotante {
    right: 14px;
    bottom: 14px;
    width: 52px;
    height: 52px;
  }
  .flotante svg {
    width: 26px;
    height: 26px;
  }
}
</style>
