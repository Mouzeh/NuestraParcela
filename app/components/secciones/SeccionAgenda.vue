<script setup lang="ts">
import { sitio, waLink } from '~~/data/sitio'
</script>

<template>
  <section id="agenda" class="agenda">
    <img class="fondo" src="/img/foto7.webp" alt="Hilera de álamos junto al camino interior" loading="lazy" width="1200" height="1200" />
    <div class="contenedor capa">
      <div class="tarjeta" v-revelar>
        <h2>Camina el terreno</h2>
        <p class="intro">
          Te mostramos deslindes, accesos y postación en una visita guiada, sin compromiso. Completa los datos y el mensaje se
          abre listo en WhatsApp.
        </p>
        <FormularioAgenda />
        <div class="contacto">
          <a :href="waLink('Hola, quiero más información sobre las parcelas.')" target="_blank" rel="noopener">{{ sitio.whatsappVisible }}</a>
          <a :href="`mailto:${sitio.email}`">{{ sitio.email }}</a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.agenda {
  position: relative;
  margin-top: var(--entre-secciones);
  isolation: isolate;
}
.fondo {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100svh;
  object-fit: cover;
  object-position: 30% center;
  z-index: -1;
}
.capa {
  position: relative;
  margin-top: -100svh;
  min-height: 100svh;
  display: flex;
  justify-content: flex-end;
  padding-top: 60px;
  padding-bottom: 60px;
}
.tarjeta {
  width: min(100%, 520px);
  align-self: flex-start;
  background: var(--papel);
  padding: 36px;
}
h2 {
  font-size: var(--paso-titulo);
}
.intro {
  margin: 14px 0 28px;
  color: var(--tinta-suave);
}
.contacto {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px 20px;
  margin-top: 24px;
}
.contacto a {
  text-decoration: none;
  overflow-wrap: anywhere;
}
.contacto a:hover {
  text-decoration: underline;
  text-underline-offset: 5px;
}
@media (max-width: 720px) {
  .fondo {
    position: relative;
    height: 70svh;
  }
  .capa {
    margin-top: -80px;
    min-height: 0;
    padding: 0 16px 24px;
  }
  .tarjeta {
    padding: 28px 20px;
  }
}
</style>
