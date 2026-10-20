<script setup lang="ts">
import { sitio, estados } from '~~/data/sitio'
import { lotes, disponibles } from '~~/data/lotes'

// Cifras del proyecto. `valor` se anima desde 0 al entrar en pantalla; `decimales` define el formato.
const cifras = [
  { valor: disponibles.length, decimales: 0, unidad: `de ${lotes.length}`, texto: 'parcelas disponibles hoy', lotes: true },
  { valor: sitio.hectareasTotales, decimales: 1, unidad: 'ha', texto: 'de campo en el proyecto' },
  { valor: sitio.minutosLosAngeles, decimales: 0, unidad: 'min', texto: 'al centro de Los Ángeles' },
  { valor: 0, decimales: 0, unidad: '%', texto: 'de comisión: le compras al dueño' },
]
const formato = (n: number, d: number) => n.toLocaleString('es-CL', { minimumFractionDigits: d, maximumFractionDigits: d })

const raiz = ref<HTMLElement>()
useAnimacion(raiz, ({ gsap, raiz }) => {
  const disparo = { trigger: raiz, start: 'top 80%', once: true }
  raiz.querySelectorAll<HTMLElement>('[data-valor]').forEach((el, i) => {
    const fin = Number(el.dataset.valor)
    const d = Number(el.dataset.decimales)
    const obj = { n: 0 }
    gsap.to(obj, {
      n: fin,
      duration: 1.8,
      delay: i * 0.12,
      ease: 'power3.out',
      scrollTrigger: disparo,
      onUpdate: () => (el.textContent = formato(obj.n, d)),
    })
  })
  gsap.fromTo(raiz.querySelectorAll('.cifra'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, stagger: 0.12, scrollTrigger: disparo })
  gsap.fromTo(raiz.querySelectorAll('.cuadro'), { scale: 0 }, { scale: 1, duration: 0.5, ease: 'back.out(2)', stagger: 0.035, delay: 0.4, scrollTrigger: disparo })
})
</script>

<template>
  <section ref="raiz" class="banda contenedor" aria-label="El proyecto en cifras">
    <div v-for="c in cifras" :key="c.texto" class="cifra">
      <p class="numero">
        <span :data-valor="c.valor" :data-decimales="c.decimales">{{ formato(c.valor, c.decimales) }}</span>
        <small>{{ c.unidad }}</small>
      </p>
      <p class="texto">{{ c.texto }}</p>
      <ul v-if="c.lotes" class="lotes" aria-label="Estado de cada parcela">
        <li
          v-for="l in lotes"
          :key="l.numero"
          class="cuadro"
          :class="l.estado"
          :title="`Parcela ${l.numero}: ${estados[l.estado]}`"
        >
          <span class="sr-only">Parcela {{ l.numero }}: {{ estados[l.estado] }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.banda {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 40px 32px;
  padding-top: clamp(48px, 6vw, 88px);
}
.numero {
  display: flex;
  align-items: baseline;
  gap: 10px;
  font-size: clamp(3.5rem, 2rem + 5vw, 7rem);
  font-weight: 300;
  letter-spacing: -0.05em;
  line-height: 0.9;
  font-variant-numeric: tabular-nums;
}
.numero small {
  font-size: var(--paso-lead);
  letter-spacing: -0.01em;
  color: var(--tinta-suave);
}
.texto {
  margin-top: 14px;
  max-width: 20ch;
}
.lotes {
  display: grid;
  grid-template-columns: repeat(9, 14px);
  gap: 5px;
  list-style: none;
  margin: 18px 0 0;
  padding: 0;
}
.cuadro {
  width: 14px;
  height: 14px;
  background: var(--disponible);
}
.cuadro.reservada {
  background: var(--reservada);
}
.cuadro.vendida {
  background: var(--vendida);
}
@media (max-width: 1000px) {
  .banda {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 560px) {
  .banda {
    gap: 36px 20px;
  }
  .numero {
    font-size: clamp(2.75rem, 14vw, 3.5rem);
    gap: 6px;
  }
  .numero small {
    font-size: var(--paso-cuerpo);
  }
  .texto {
    margin-top: 8px;
    font-size: 16px;
  }
  .lotes {
    grid-template-columns: repeat(9, 10px);
    gap: 4px;
  }
  .cuadro {
    width: 10px;
    height: 10px;
  }
}
</style>
