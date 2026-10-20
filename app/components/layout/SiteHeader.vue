<script setup lang="ts">
import { gsap } from 'gsap'
import { sitio, waLink } from '~~/data/sitio'

const enlaces = [
  { href: '#terreno', texto: 'El terreno' },
  { href: '#plano', texto: 'Parcelas' },
  { href: '#incluye', texto: 'Qué incluye' },
  { href: '#ubicacion', texto: 'Ubicación' },
  { href: '#precio', texto: 'Precio' },
  { href: '#preguntas', texto: 'Preguntas' },
]

// Sobre la portada la barra es transparente; al bajar toma fondo, se esconde mientras
// se avanza y reaparece apenas se sube.
const solido = ref(false)
const oculto = ref(false)
const activo = ref('')
const abierto = ref(false)
const panel = ref<HTMLElement>()
const botonMenu = ref<HTMLButtonElement>()

onMounted(() => {
  let ultimo = window.scrollY
  const revisar = () => {
    const y = window.scrollY
    solido.value = y > 60
    oculto.value = y > window.innerHeight * 0.6 && y > ultimo && !abierto.value
    ultimo = y
  }
  revisar()
  window.addEventListener('scroll', revisar, { passive: true })

  // Sección visible: la que cruza la mitad de la pantalla.
  const obs = new IntersectionObserver(
    (entradas) => entradas.forEach((e) => e.isIntersecting && (activo.value = `#${e.target.id}`)),
    { rootMargin: '-50% 0px -50% 0px' },
  )
  enlaces.forEach((e) => {
    const s = document.querySelector(e.href)
    if (s) obs.observe(s)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', revisar)
    obs.disconnect()
  })
})

const reducir = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const abrir = async () => {
  abierto.value = true
  document.body.style.overflow = 'hidden'
  await nextTick()
  const p = panel.value!
  if (!reducir()) {
    gsap
      .timeline()
      .fromTo(p, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'expo.inOut' })
      .fromTo(p.querySelectorAll('.menu-enlace'), { yPercent: 110 }, { yPercent: 0, duration: 0.9, stagger: 0.06 }, '-=0.35')
      .fromTo(p.querySelectorAll('.menu-pie > *'), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, stagger: 0.08 }, '-=0.7')
  }
  p.querySelector<HTMLElement>('.menu-enlace')?.focus()
}

const cerrar = () => {
  if (!abierto.value) return
  const terminar = () => {
    abierto.value = false
    document.body.style.overflow = ''
    botonMenu.value?.focus()
  }
  if (reducir() || !panel.value) return terminar()
  gsap.to(panel.value, { clipPath: 'inset(0 0 100% 0)', duration: 0.6, ease: 'expo.inOut', onComplete: terminar })
}

const teclas = (e: KeyboardEvent) => e.key === 'Escape' && cerrar()
</script>

<template>
  <header class="cabecera" :class="{ solido, oculto, 'sobre-video': sitio.heroVideo && !solido }" @keydown="teclas">
    <nav class="contenedor fila" aria-label="Principal">
      <a href="#inicio" class="marca">
        <span class="nombre">{{ sitio.nombre }}</span>
        <span class="lugar">El Aromo · Los Ángeles</span>
      </a>
      <ul class="enlaces">
        <li v-for="e in enlaces" :key="e.href">
          <a :href="e.href" :class="{ actual: activo === e.href }" :aria-current="activo === e.href ? 'location' : undefined">{{ e.texto }}</a>
        </li>
      </ul>
      <div class="derecha">
        <a :href="waLink('Hola, quiero información sobre las parcelas.')" target="_blank" rel="noopener" class="telefono">
          {{ sitio.whatsappVisible }}
        </a>
        <a href="#agenda" class="boton accion">Agendar visita</a>
        <button ref="botonMenu" class="menu" :aria-expanded="abierto" aria-controls="menu-movil" @click="abrir">
          <span>Menú</span>
          <span class="rayas" aria-hidden="true" />
        </button>
      </div>
    </nav>

    <div v-if="abierto" id="menu-movil" ref="panel" class="panel" role="dialog" aria-modal="true" aria-label="Menú">
      <div class="contenedor panel-arriba">
        <span class="nombre">{{ sitio.nombre }}</span>
        <button class="menu" @click="cerrar"><span>Cerrar</span><span class="rayas cruz" aria-hidden="true" /></button>
      </div>
      <ul class="contenedor menu-lista">
        <li v-for="e in enlaces" :key="e.href">
          <span class="menu-mascara"><a :href="e.href" class="menu-enlace" @click="cerrar">{{ e.texto }}</a></span>
        </li>
      </ul>
      <div class="contenedor menu-pie">
        <a href="#agenda" class="boton boton-papel" @click="cerrar">Agendar visita</a>
        <a :href="waLink('Hola, quiero información sobre las parcelas.')" target="_blank" rel="noopener">WhatsApp {{ sitio.whatsappVisible }}</a>
        <a :href="`mailto:${sitio.email}`">{{ sitio.email }}</a>
      </div>
    </div>
  </header>
</template>

<style scoped>
.cabecera {
  position: fixed;
  inset: 0 0 auto;
  z-index: 50;
  color: var(--tinta);
  transition:
    background-color 0.4s,
    color 0.4s,
    transform 0.5s var(--facil);
}
.sobre-video {
  color: var(--papel);
}
.solido {
  background: var(--papel);
}
.oculto {
  transform: translateY(-100%);
}
.fila {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 24px;
  height: 88px;
  transition: height 0.4s var(--facil);
}
.solido .fila {
  height: 68px;
}
.marca {
  display: grid;
  text-decoration: none;
  line-height: 1.05;
  width: fit-content;
}
.nombre {
  font-size: var(--paso-lead);
  font-weight: 500;
  letter-spacing: -0.02em;
}
.lugar {
  font-size: var(--paso-chico);
  opacity: 0.8;
}
.enlaces {
  display: flex;
  gap: 4px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.enlaces a {
  position: relative;
  display: block;
  padding: 8px 12px;
  text-decoration: none;
  font-size: 17px;
}
/* Línea al pasar el cursor; punto bajo el enlace de la sección visible. */
.enlaces a::after {
  content: '';
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 2px;
  height: 1px; /* taste-skill-ignore: subrayado al pasar el cursor */
  background: currentColor;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.4s var(--facil);
}
.enlaces a:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}
.enlaces a.actual::before {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -6px;
  width: 5px;
  height: 5px;
  margin-left: -2.5px;
  border-radius: 50%;
  background: currentColor;
}
.derecha {
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 20px;
}
.telefono {
  font-size: 17px;
  text-decoration: none;
  white-space: nowrap;
}
.telefono:hover {
  text-decoration: underline;
  text-underline-offset: 5px;
}
.accion {
  min-height: 44px;
  padding: 0 20px;
  font-size: 17px;
}
.sobre-video .accion {
  background: var(--papel);
  color: var(--tinta);
}
.menu {
  display: none;
  align-items: center;
  gap: 12px;
  min-height: 44px;
  padding: 0;
  border: 0;
  background: none;
  font-size: 17px;
}
.rayas {
  position: relative;
  width: 22px;
  height: 8px;
}
.rayas::before,
.rayas::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 1.5px;
  background: currentColor;
  transition: transform 0.3s var(--facil);
}
.rayas::before {
  top: 0;
}
.rayas::after {
  bottom: 0;
}
.menu:hover .rayas::after {
  transform: scaleX(0.6);
  transform-origin: right;
}
.cruz::before {
  top: 3px;
  transform: rotate(45deg);
}
.cruz::after {
  bottom: 3px;
  transform: rotate(-45deg);
}

/* Menú a pantalla completa (tablet y teléfono). */
.panel {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: flex;
  flex-direction: column;
  background: var(--bosque);
  color: var(--papel);
  overflow-y: auto;
}
.panel-arriba {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 72px;
  flex: none;
}
.panel .menu {
  display: inline-flex;
}
.menu-lista {
  list-style: none;
  margin: auto 0;
  padding-top: 24px;
  padding-bottom: 24px;
}
.menu-mascara {
  display: block;
  overflow: hidden;
}
.menu-enlace {
  display: block;
  padding: 4px 0;
  font-size: clamp(2.25rem, 9vw, 4rem);
  font-weight: 300;
  letter-spacing: -0.03em;
  line-height: 1.1;
  text-decoration: none;
}
.menu-enlace:hover,
.menu-enlace:focus-visible {
  font-style: italic;
}
.menu-pie {
  display: grid;
  justify-items: start;
  gap: 12px;
  padding-bottom: 32px;
}
.menu-pie a:not(.boton) {
  text-decoration: none;
}

@media (max-width: 1240px) {
  .telefono {
    display: none;
  }
}
@media (max-width: 1100px) {
  .fila {
    grid-template-columns: 1fr auto;
  }
  .enlaces {
    display: none;
  }
  .menu {
    display: inline-flex;
  }
}
@media (max-width: 720px) {
  .fila,
  .solido .fila {
    height: 64px;
  }
  .lugar,
  .accion {
    display: none;
  }
}
</style>
