<script setup lang="ts">
import { waLink } from '~~/data/sitio'
import { lotes } from '~~/data/lotes'

// El formulario no se envía a un servidor: arma el mensaje y lo abre listo en WhatsApp.
const motivos = ['Agendar una visita', 'Recibir más información', 'Hablar con el dueño']
const horarios = ['Mañana (9:00 – 13:00)', 'Tarde (14:00 – 18:00)', 'Me da lo mismo']
const origenes = ['Instagram', 'Facebook', 'Google', 'Recomendación', 'Otro']

const form = reactive({
  nombre: '',
  motivo: motivos[0]!,
  fecha: '',
  horario: horarios[0]!,
  parcela: '',
  origen: '',
  mensaje: '',
})

const hoy = ref('')
onMounted(() => {
  const d = new Date()
  hoy.value = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
})

const esVisita = computed(() => form.motivo === motivos[0])
const fechaLegible = computed(() =>
  form.fecha ? new Date(form.fecha + 'T12:00').toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' }) : '',
)

const enviar = () => {
  const lineas = [
    `Hola, soy ${form.nombre.trim()}.`,
    `Quiero: ${form.motivo.toLowerCase()}.`,
    esVisita.value && fechaLegible.value ? `Día preferido: ${fechaLegible.value}, ${form.horario.toLowerCase()}.` : '',
    form.parcela ? `Parcela de interés: N° ${form.parcela}.` : '',
    form.mensaje.trim(),
    form.origen ? `(Los conocí por ${form.origen})` : '',
  ]
  window.open(waLink(lineas.filter(Boolean).join('\n')), '_blank', 'noopener')
}
</script>

<template>
  <form class="form" @submit.prevent="enviar">
    <label class="ancho">
      <span>Tu nombre</span>
      <input v-model="form.nombre" type="text" name="nombre" autocomplete="name" required placeholder="Ej. Camila Soto" />
    </label>
    <fieldset class="ancho">
      <legend>¿Qué necesitas?</legend>
      <div class="opciones">
        <label v-for="m in motivos" :key="m" class="opcion">
          <input v-model="form.motivo" type="radio" name="motivo" :value="m" />
          <span>{{ m }}</span>
        </label>
      </div>
    </fieldset>
    <template v-if="esVisita">
      <label>
        <span>Día preferido</span>
        <input v-model="form.fecha" type="date" name="fecha" :min="hoy" />
      </label>
      <label>
        <span>Horario</span>
        <select v-model="form.horario" name="horario">
          <option v-for="h in horarios" :key="h">{{ h }}</option>
        </select>
      </label>
    </template>
    <label>
      <span>Parcela de interés</span>
      <select v-model="form.parcela" name="parcela">
        <option value="">Aún no sé</option>
        <option v-for="l in lotes.filter((x) => x.estado !== 'vendida')" :key="l.numero" :value="l.numero">
          Parcela {{ l.numero }} · {{ l.superficie.toLocaleString('es-CL') }} m²
        </option>
      </select>
    </label>
    <label>
      <span>¿Cómo nos conociste?</span>
      <select v-model="form.origen" name="origen">
        <option value="">Seleccionar</option>
        <option v-for="o in origenes" :key="o">{{ o }}</option>
      </select>
    </label>
    <label class="ancho">
      <span>Mensaje (opcional)</span>
      <textarea v-model="form.mensaje" name="mensaje" rows="2" placeholder="Cuéntanos qué te interesa saber" />
    </label>
    <button type="submit" class="boton ancho"><Icono nombre="whatsapp" /> Enviar por WhatsApp</button>
  </form>
</template>

<style scoped>
.form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.ancho {
  grid-column: 1 / -1;
}
label > span,
legend {
  display: block;
  font-size: var(--paso-chico);
  color: var(--tinta-suave);
  margin-bottom: 6px;
}
fieldset {
  border: 0;
  margin: 0;
  padding: 0;
  min-width: 0;
}
input:not([type='radio']),
select,
textarea {
  width: 100%;
  min-height: 48px;
  padding: 10px 14px;
  font: inherit;
  font-size: 17px;
  color: var(--tinta);
  background: var(--fondo);
  border: 1px solid transparent;
  border-radius: 0;
  appearance: none;
  transition:
    border-color 0.2s,
    background-color 0.2s;
}
select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none' stroke='%23465247' stroke-width='1.6'%3E%3Cpath d='m1 1 5 5 5-5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 36px;
}
textarea {
  resize: vertical;
}
input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: var(--acento);
  background-color: var(--papel);
}
.opciones {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.opcion input {
  position: absolute;
  opacity: 0;
}
.opcion span {
  display: inline-block;
  padding: 10px 14px;
  background: var(--fondo);
  font-size: var(--paso-chico);
  cursor: pointer;
  transition: background-color 0.2s;
}
.opcion span:hover {
  background: var(--superficie);
}
.opcion input:checked + span {
  background: var(--bosque);
  color: var(--papel);
}
.opcion input:focus-visible + span {
  outline: 2px solid var(--acento);
  outline-offset: 2px;
}
.form .boton {
  min-height: 56px;
  margin-top: 8px;
}
@media (max-width: 420px) {
  .form {
    grid-template-columns: 1fr;
  }
}
</style>
