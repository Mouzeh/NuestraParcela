<script setup lang="ts">
import { sitio, waLink } from '~~/data/sitio'
import { preguntas } from '~~/data/preguntas'
</script>

<template>
  <section id="preguntas" class="preguntas">
    <div class="contenedor rejilla">
      <div class="texto">
        <h2 v-revelar>Preguntas frecuentes</h2>
        <div class="datos" v-revelar="1">
          <p>{{ sitio.ubicacion }}</p>
          <p>Acceso por {{ sitio.acceso.charAt(0).toLowerCase() + sitio.acceso.slice(1) }}</p>
          <p>WhatsApp {{ sitio.whatsappVisible }}</p>
        </div>
        <div class="lista" v-revelar="2">
          <details v-for="(p, i) in preguntas" :key="p.pregunta" :open="i === 0">
            <summary>{{ p.pregunta }}</summary>
            <p>{{ p.respuesta }}</p>
          </details>
        </div>
        <div class="acciones" v-revelar="3">
          <a :href="waLink('Hola, tengo una pregunta sobre las parcelas.')" target="_blank" rel="noopener" class="boton">
            <Icono nombre="whatsapp" /> Hacer otra pregunta
          </a>
          <a :href="sitio.planoPdf" target="_blank" rel="noopener" class="enlace">Plano oficial (PDF) <Icono nombre="flecha" /></a>
        </div>
      </div>
      <div class="fotos">
        <img class="alta" src="/img/foto5.webp" alt="Poste de luz y árboles con sol de tarde" loading="lazy" width="1200" height="1600" />
        <img class="cuadrada" v-revelar="2" src="/img/foto10.webp" alt="Pradera con árboles al fondo" loading="lazy" width="384" height="512" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.preguntas {
  margin-top: var(--entre-secciones);
  background: var(--superficie);
}
.rejilla {
  display: grid;
  grid-template-columns: 5fr 1fr 6fr;
  padding-bottom: 80px;
}
.texto {
  min-width: 0;
  padding-top: clamp(64px, 8vw, 120px);
}
.datos {
  margin: 24px 0 40px;
}
.lista {
  display: grid;
  gap: 4px;
}
details {
  padding: 12px 0;
}
summary {
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  min-height: 44px;
  cursor: pointer;
  font-size: var(--paso-lead);
  line-height: 1.25;
  letter-spacing: -0.01em;
}
summary::-webkit-details-marker {
  display: none;
}
/* Chevrón de dos trazos. */
summary::after {
  content: '';
  flex: none;
  width: 10px;
  height: 10px;
  margin-right: 4px;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  rotate: 45deg;
  translate: 0 -3px;
  transition: rotate 0.3s var(--facil);
}
details[open] summary::after {
  rotate: 225deg;
  translate: 0 3px;
}
details p {
  padding-top: 10px;
  max-width: 54ch;
  color: var(--tinta-suave);
}
@media (prefers-reduced-motion: no-preference) {
  details[open] p {
    animation: abrir 0.4s var(--facil);
  }
}
@keyframes abrir {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
}
.acciones {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px 28px;
  margin-top: 40px;
}
.fotos {
  grid-column: 3;
  position: relative;
  align-self: start;
}
.alta {
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  margin-top: -64px;
}
.cuadrada {
  position: absolute;
  left: -40px;
  bottom: -40px;
  width: 36%;
  aspect-ratio: 1;
  object-fit: cover;
}
@media (max-width: 900px) {
  .rejilla {
    grid-template-columns: minmax(0, 1fr);
  }
  .fotos {
    grid-column: 1;
    grid-row: 1;
    margin: 0 calc(var(--margen) * -1);
  }
  .alta {
    margin-top: 0;
    aspect-ratio: 4 / 5;
  }
  .cuadrada {
    left: auto;
    right: var(--margen);
    bottom: -32px;
    width: 38%;
  }
  .texto {
    padding-top: 72px;
  }
  .acciones .boton {
    width: 100%;
  }
}
</style>
