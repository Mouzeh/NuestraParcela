<script setup lang="ts">
import { sitio, estados, clp, waLink } from '~~/data/sitio'
import { centroide, hectareas, type Lote } from '~~/data/lotes'

const props = defineProps<{ lote: Lote; vertical?: boolean }>()

const enlaceMaps = computed(() => {
  const [lat, lon] = centroide(props.lote.coords)
  return `https://www.google.com/maps/search/?api=1&query=${lat.toFixed(6)},${lon.toFixed(6)}`
})
const mensaje = computed(
  () =>
    `Hola, me interesa la parcela N° ${props.lote.numero} (${props.lote.superficie.toLocaleString('es-CL')} m²). ¿Podemos coordinar una visita?`,
)
</script>

<template>
  <aside class="ficha" :class="{ vertical }" aria-live="polite">
    <div class="cabeza">
      <p :key="lote.numero" class="num">Parcela {{ lote.numero }}</p>
      <span class="chip-estado" :style="{ '--color': `var(--${lote.estado})` }">{{ estados[lote.estado] }}</span>
    </div>
    <dl>
      <div>
        <dt>Superficie</dt>
        <dd>{{ lote.superficie.toLocaleString('es-CL') }} m² <small>({{ hectareas(lote.superficie) }} ha)</small></dd>
      </div>
      <div>
        <dt>Servidumbre de tránsito</dt>
        <dd>{{ lote.servidumbre ? `${lote.servidumbre.toLocaleString('es-CL')} m²` : '6 m de ancho' }}</dd>
      </div>
      <div>
        <dt>Perímetro aprox.</dt>
        <dd>{{ lote.perimetro.toLocaleString('es-CL') }} m</dd>
      </div>
      <div class="ancho">
        <dt>Medidas aprox. de los deslindes</dt>
        <dd>{{ lote.lados.map((x) => x.toLocaleString('es-CL') + ' m').join(' · ') }}</dd>
      </div>
      <div class="ancho">
        <dt>Valor</dt>
        <dd class="valor">{{ lote.precio ? clp(lote.precio) : 'Consultar' }}</dd>
      </div>
    </dl>
    <div class="acciones">
      <a v-if="lote.estado !== 'vendida'" :href="waLink(mensaje)" target="_blank" rel="noopener" class="boton">
        <Icono nombre="whatsapp" /> Consultar por la parcela {{ lote.numero }}
      </a>
      <a :href="enlaceMaps" target="_blank" rel="noopener" class="enlace">Ver en Google Maps <Icono nombre="flecha" /></a>
    </div>
    <p class="nota">
      Superficie según el plano de subdivisión. Perímetro y deslindes calculados del plano georreferenciado.
      <a :href="sitio.planoPdf" target="_blank" rel="noopener">Ver plano oficial (PDF)</a>
    </p>
  </aside>
</template>

<style scoped>
.ficha {
  background: var(--papel);
  color: var(--tinta);
  padding: clamp(24px, 3vw, 36px);
  display: grid;
  grid-template-columns: 3fr 5fr 4fr;
  gap: 16px 40px;
  align-items: start;
}
.ficha .nota {
  grid-column: 1 / -1;
}
.ficha.vertical {
  grid-template-columns: 1fr;
  align-content: start;
  gap: 28px;
}
@media (max-width: 1000px) {
  .ficha {
    grid-template-columns: 1fr;
  }
}
.cabeza {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.num {
  font-size: var(--paso-titulo);
  letter-spacing: -0.03em;
  line-height: 1;
  animation: cambio 0.45s var(--facil);
}
@keyframes cambio {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
}
dl {
  margin: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px 20px;
}
.ancho {
  grid-column: 1 / -1;
}
dt {
  font-size: var(--paso-chico);
  color: var(--tinta-suave);
}
dd {
  margin: 2px 0 0;
}
dd small {
  font-size: var(--paso-chico);
  color: var(--tinta-suave);
}
.valor {
  font-size: var(--paso-lead);
  font-weight: 500;
}
.acciones {
  display: grid;
  justify-items: start;
  gap: 18px;
}
.acciones .boton {
  width: 100%;
}
.nota {
  padding-top: 8px;
  font-size: var(--paso-chico);
  color: var(--tinta-suave);
}
.nota a {
  color: var(--tinta);
}
@media (prefers-reduced-motion: reduce) {
  .num {
    animation: none;
  }
}
</style>
