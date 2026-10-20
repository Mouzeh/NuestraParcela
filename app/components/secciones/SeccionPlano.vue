<script setup lang="ts">
import { estados } from '~~/data/sitio'
import { lotes, disponibles, conteoEstados, type Lote } from '~~/data/lotes'

const vista = ref<'plano' | 'satelite'>('satelite')
const claveGoogle = useRuntimeConfig().public.googleMapsKey as string
const usarGoogle = ref(Boolean(claveGoogle))
const seleccion = ref<Lote>(disponibles[0] ?? lotes[0]!)
const elegir = (l: Lote) => (seleccion.value = l)
</script>

<template>
  <section id="plano" class="plano">
    <div class="contenedor">
      <div class="intro">
        <h2 v-revelar>Elige tu parcela</h2>
        <p v-revelar="1">
          Los deslindes reales del plano de subdivisión sobre la vista satelital. Toca un lote para ver su superficie y su valor.
        </p>
      </div>

      <div class="barra" v-revelar="2">
        <p class="leyenda">
          <span v-for="c in conteoEstados" :key="c.estado" class="chip-estado" :style="{ '--color': `var(--${c.estado})` }">
            {{ c.total }} {{ estados[c.estado].toLowerCase() }}{{ c.total === 1 ? '' : 's' }}
          </span>
        </p>
        <div class="vistas" role="group" aria-label="Tipo de vista">
          <button :aria-pressed="vista === 'satelite'" @click="vista = 'satelite'">Satélite</button>
          <button :aria-pressed="vista === 'plano'" @click="vista = 'plano'">Plano</button>
        </div>
      </div>

      <div class="panel" :class="{ alto: vista === 'satelite' }" v-revelar="3">
        <div class="lienzo">
          <PlanoSvg v-show="vista === 'plano'" :seleccion="seleccion.numero" @elegir="elegir" />
          <ClientOnly>
            <template v-if="vista === 'satelite'">
              <MapaGoogle v-if="usarGoogle" :clave="claveGoogle" :seleccion="seleccion.numero" @elegir="elegir" @falla="usarGoogle = false" />
              <MapaSatelital v-else :seleccion="seleccion.numero" @elegir="elegir" />
            </template>
            <template #fallback>
              <PlanoSvg v-if="vista === 'satelite'" :seleccion="seleccion.numero" @elegir="elegir" />
            </template>
          </ClientOnly>
          <SelectorLotes :seleccion="seleccion.numero" @elegir="elegir" />
        </div>
        <FichaLote :lote="seleccion" :vertical="vista === 'satelite'" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.plano {
  margin-top: var(--entre-secciones);
  padding: clamp(80px, 10vw, 140px) 0;
  background: var(--bosque);
  color: var(--sobre-bosque);
}
.intro {
  display: grid;
  grid-template-columns: 5fr 7fr;
  gap: 32px;
  align-items: end;
}
.intro p {
  font-size: var(--paso-lead);
  line-height: 1.35;
  max-width: 40ch;
  color: var(--sobre-bosque);
}
.barra {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin: clamp(40px, 5vw, 64px) 0 16px;
}
.leyenda {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 24px;
}
.vistas {
  display: flex;
  background: var(--bosque-2);
  padding: 4px;
}
.vistas button {
  border: 0;
  background: none;
  padding: 8px 20px;
  min-height: 44px;
  transition: background-color 0.2s;
}
.vistas button[aria-pressed='true'] {
  background: var(--papel);
  color: var(--bosque);
}
.panel {
  display: grid;
  gap: 4px;
}
/* El loteo es largo de norte a sur: en satélite, mapa alto y ficha al costado. */
.panel.alto {
  grid-template-columns: minmax(0, 1fr) 380px;
}
@media (max-width: 1000px) {
  .panel.alto {
    grid-template-columns: 1fr;
  }
}
.lienzo {
  background: var(--bosque-2);
  display: flex;
  flex-direction: column;
  min-width: 0;
}
@media (max-width: 720px) {
  .intro {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .intro p {
    font-size: var(--paso-cuerpo);
  }
  .panel {
    margin: 0 calc(var(--margen) * -1);
  }
}
</style>
