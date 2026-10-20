<script setup lang="ts">
import { sitio, clp, waLink } from '~~/data/sitio'
import { lotes, disponibles, hectareas } from '~~/data/lotes'

const grandes = lotes.filter((l) => l.precio === null)
const conPrecio = lotes.filter((l) => l.precio !== null)
const estandar = disponibles.filter((l) => l.precio !== null).length
const m2 = (n: number) => n.toLocaleString('es-CL')
const minimo = Math.min(...conPrecio.map((l) => l.superficie))
const maximo = Math.max(...conPrecio.map((l) => l.superficie))

const incluido = [
  { nombre: 'Rol propio y escritura', detalle: 'A tu nombre, de inmediato', valor: 'Incluido' },
  { nombre: 'Poste eléctrico', detalle: 'Instalado en cada parcela', valor: 'Incluido' },
  { nombre: 'Fibra óptica', detalle: 'Internet y TV disponibles', valor: 'Disponible' },
  { nombre: 'Portón de acceso', detalle: 'Exclusivo para residentes', valor: 'Incluido' },
  { nombre: 'Comisión de corredor', detalle: 'Le compras directo al dueño', valor: '$0' },
]
</script>

<template>
  <section id="precio" class="precio contenedor">
    <div class="lado">
      <h2 v-revelar>Precio</h2>
      <img v-revelar="1" src="/img/foto8.webp" alt="Pradera de pasto alto y cielo despejado" loading="lazy" width="384" height="512" />
    </div>
    <div class="carta">
      <div class="grupo" v-revelar>
        <h3>Parcelas</h3>
        <div class="item">
          <div>
            <p class="nombre">Parcela de media hectárea</p>
            <p class="detalle">Entre {{ m2(minimo) }} y {{ m2(maximo) }} m², al contado. Quedan {{ estandar }} de {{ conPrecio.length }}.</p>
          </div>
          <p class="valor">{{ clp(sitio.precio) }}</p>
        </div>
        <div v-for="l in grandes" :key="l.numero" class="item">
          <div>
            <p class="nombre">Parcela {{ l.numero }}, de {{ hectareas(l.superficie) }} ha</p>
            <p class="detalle">La única de una hectárea del proyecto.</p>
          </div>
          <p class="valor">Consultar</p>
        </div>
        <a :href="waLink('Hola, quiero cotizar una parcela de media hectárea.')" target="_blank" rel="noopener" class="boton cotizar">
          <Icono nombre="whatsapp" /> Cotizar por WhatsApp
        </a>
      </div>
      <div class="grupo" v-revelar="1">
        <h3>Ya incluido en el valor</h3>
        <div v-for="i in incluido" :key="i.nombre" class="item">
          <div>
            <p class="nombre">{{ i.nombre }}</p>
            <p class="detalle">{{ i.detalle }}</p>
          </div>
          <p class="valor">{{ i.valor }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.precio {
  margin-top: var(--entre-secciones);
  display: grid;
  grid-template-columns: 3fr 1fr 8fr;
}
.lado {
  grid-column: 1;
}
.lado img {
  margin-top: 40px;
  width: 100%;
  aspect-ratio: 4 / 5;
  object-fit: cover;
}
.carta {
  grid-column: 3;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: start;
}
h3 {
  font-size: var(--paso-lead);
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 1.2;
  margin-bottom: 28px;
}
.item {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
}
.item + .item {
  margin-top: 22px;
}
.detalle {
  color: var(--tinta-suave);
  font-size: var(--paso-chico);
  max-width: 36ch;
}
.valor {
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}
.cotizar {
  margin-top: 40px;
}
@media (max-width: 1000px) {
  .precio {
    grid-template-columns: 1fr;
  }
  .lado,
  .carta {
    grid-column: 1;
  }
  .lado img {
    width: 100%;
    aspect-ratio: 16 / 10;
    margin: 28px 0 48px;
  }
  .carta {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}
@media (max-width: 480px) {
  .cotizar {
    width: 100%;
  }
}
</style>
