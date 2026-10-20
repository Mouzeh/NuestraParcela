<script setup lang="ts">
import { estados } from '~~/data/sitio'
import { lotes, type Lote } from '~~/data/lotes'

defineProps<{ seleccion: number }>()
const emit = defineEmits<{ elegir: [lote: Lote] }>()
</script>

<template>
  <div class="selector" role="group" aria-label="Lista de parcelas">
    <button
      v-for="l in lotes"
      :key="l.numero"
      :class="[l.estado, { activo: seleccion === l.numero }]"
      :aria-pressed="seleccion === l.numero"
      :aria-label="`Parcela ${l.numero}, ${estados[l.estado]}`"
      @click="emit('elegir', l)"
    >
      {{ l.numero }}
    </button>
  </div>
</template>

<style scoped>
.selector {
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 4px;
  padding: 12px 16px 16px;
}
button {
  position: relative;
  height: 44px;
  border: 0;
  background: rgba(232, 235, 226, 0.08);
  font-size: var(--paso-cuerpo);
  transition:
    background-color 0.2s,
    transform 0.15s var(--facil);
}
button:hover {
  background: rgba(232, 235, 226, 0.18);
}
button:active {
  transform: scale(0.94);
}
button::after {
  content: '';
  position: absolute;
  top: 6px;
  right: 6px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--disponible);
}
.reservada::after {
  background: var(--reservada);
}
.vendida {
  opacity: 0.5;
}
.vendida::after {
  background: var(--vendida);
}
button.activo {
  background: var(--papel);
  color: var(--bosque);
}
@media (max-width: 560px) {
  .selector {
    grid-template-columns: repeat(6, 1fr);
    padding: 8px;
  }
}
</style>
