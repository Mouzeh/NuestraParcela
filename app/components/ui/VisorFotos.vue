<script setup lang="ts">
import { fotos } from '~~/data/fotos'

const { activa, cerrar } = useVisor()
const dialogo = ref<HTMLDialogElement>()

watch(activa, (i) => {
  if (i === null) dialogo.value?.close()
  else if (!dialogo.value?.open) dialogo.value?.showModal()
})

const mover = (d: number) => {
  if (activa.value === null) return
  activa.value = (activa.value + d + fotos.length) % fotos.length
}
const teclas = (e: KeyboardEvent) => {
  if (e.key === 'ArrowRight') mover(1)
  if (e.key === 'ArrowLeft') mover(-1)
}

let inicioX = 0
const tocar = (e: TouchEvent) => (inicioX = e.touches[0]!.clientX)
const soltar = (e: TouchEvent) => {
  const dx = e.changedTouches[0]!.clientX - inicioX
  if (Math.abs(dx) > 50) mover(dx < 0 ? 1 : -1)
}
</script>

<template>
  <dialog
    ref="dialogo"
    class="visor"
    aria-label="Fotos del terreno"
    @keydown="teclas"
    @click.self="cerrar"
    @close="cerrar"
    @touchstart.passive="tocar"
    @touchend="soltar"
  >
    <template v-if="activa !== null">
      <img :key="activa" :src="`/img/foto${fotos[activa]!.n}.webp`" :alt="fotos[activa]!.alt" />
      <p class="pie">{{ fotos[activa]!.alt }} <span>{{ activa + 1 }} de {{ fotos.length }}</span></p>
      <button class="ctrl cerrar" aria-label="Cerrar" @click="cerrar"><Icono nombre="cerrar" /></button>
      <button class="ctrl izq" aria-label="Foto anterior" @click="mover(-1)"><Icono nombre="izq" /></button>
      <button class="ctrl der" aria-label="Foto siguiente" @click="mover(1)"><Icono nombre="der" /></button>
    </template>
  </dialog>
</template>

<style scoped>
.visor {
  width: 100vw;
  height: 100dvh;
  max-width: none;
  max-height: none;
  margin: 0;
  padding: 0;
  border: 0;
  background: #0d130e;
  color: var(--sobre-bosque);
}
.visor[open] {
  display: grid;
  place-items: center;
}
.visor::backdrop {
  background: transparent;
}
img {
  max-width: min(92vw, 1400px);
  max-height: 80dvh;
  object-fit: contain;
  animation: aparecer 0.4s var(--facil);
}
@keyframes aparecer {
  from {
    opacity: 0;
    transform: scale(0.98);
  }
}
.pie {
  position: absolute;
  left: var(--margen);
  right: var(--margen);
  bottom: 24px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  font-size: var(--paso-chico);
}
.pie span {
  color: var(--sobre-bosque-suave);
  white-space: nowrap;
}
.ctrl {
  position: absolute;
  width: 52px;
  height: 52px;
  border: 0;
  background: rgba(232, 235, 226, 0.12);
  display: grid;
  place-items: center;
  transition: background-color 0.2s;
}
.ctrl:hover {
  background: rgba(232, 235, 226, 0.24);
}
.ctrl svg {
  width: 22px;
  height: 22px;
}
.cerrar {
  top: 16px;
  right: 16px;
}
.izq {
  left: 16px;
  top: 50%;
  translate: 0 -50%;
}
.der {
  right: 16px;
  top: 50%;
  translate: 0 -50%;
}
@media (max-width: 640px) {
  .izq,
  .der {
    top: auto;
    bottom: 64px;
    translate: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  img {
    animation: none;
  }
}
</style>
