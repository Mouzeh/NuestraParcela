<script setup lang="ts">
defineProps<{ nombre: string }>()
</script>

<template>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <template v-if="nombre === 'whatsapp'">
      <path fill="currentColor" stroke="none" d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2Zm5.8 14.13c-.24.69-1.42 1.32-1.96 1.37-.5.05-.97.24-3.27-.68-2.77-1.09-4.52-3.94-4.66-4.12-.13-.18-1.1-1.47-1.1-2.8 0-1.33.7-1.99.95-2.26.24-.27.53-.34.71-.34h.51c.16 0 .39-.06.6.46.24.56.8 1.94.87 2.08.07.14.12.3.02.48-.09.18-.14.3-.27.46-.14.16-.29.36-.41.48-.14.14-.28.28-.12.56.16.27.71 1.18 1.53 1.91 1.05.94 1.94 1.23 2.21 1.37.27.14.43.12.59-.07.16-.18.68-.8.86-1.07.18-.27.36-.23.6-.14.25.09 1.58.75 1.85.88.27.14.45.2.52.32.07.11.07.66-.17 1.35Z"/>
    </template>
    <template v-else-if="nombre === 'documento'"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></template>
    <template v-else-if="nombre === 'rayo'"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></template>
    <template v-else-if="nombre === 'wifi'"><path d="M2 8.8a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19.5" r=".8" fill="currentColor"/></template>
    <template v-else-if="nombre === 'gota'"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/></template>
    <template v-else-if="nombre === 'porton'"><path d="M3 21V7l4-3 4 3v14M13 21V7l4-3 4 3v14M3 12h18M3 17h18"/></template>
    <template v-else-if="nombre === 'basura'"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></template>
    <template v-else-if="nombre === 'mano'"><path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12M11 11V4.5a1.5 1.5 0 0 1 3 0V12M14 11.5V6a1.5 1.5 0 0 1 3 0v7.5c0 4-2.5 7-6.5 7-2.5 0-4-1.2-5.5-3.2L3 14a1.6 1.6 0 0 1 2.5-2L8 15"/></template>
    <template v-else-if="nombre === 'pino'"><path d="M12 2 6 10h3l-4 6h5v6h4v-6h5l-4-6h3z"/></template>
    <template v-else-if="nombre === 'auto'"><path d="M5 17h14M3 13l2-6h14l2 6v4H3zM7 17v2M17 17v2"/><circle cx="7.5" cy="13.5" r=".8" fill="currentColor"/><circle cx="16.5" cy="13.5" r=".8" fill="currentColor"/></template>
    <template v-else-if="nombre === 'grafico'"><path d="M3 20h18M5 16l5-5 4 3 6-7"/><path d="M15 7h5v5"/></template>
    <template v-else-if="nombre === 'ubicacion'"><path d="M12 21s7-6.2 7-11.5a7 7 0 1 0-14 0C5 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/></template>
    <template v-else-if="nombre === 'calendario'"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></template>
    <template v-else-if="nombre === 'flecha'"><path d="M5 12h14M13 6l6 6-6 6"/></template>
    <template v-else-if="nombre === 'cerrar'"><path d="M6 6l12 12M18 6 6 18"/></template>
    <template v-else-if="nombre === 'izq'"><path d="M15 6l-6 6 6 6"/></template>
    <template v-else-if="nombre === 'der'"><path d="M9 6l6 6-6 6"/></template>
    <template v-else-if="nombre === 'mapa'"><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/></template>
    <template v-else-if="nombre === 'capas'"><path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/></template>
    <template v-else-if="nombre === 'play'"><path fill="currentColor" stroke="none" d="M8 5.5v13l11-6.5z"/></template>
    <template v-else-if="nombre === 'mas'"><path d="M12 5v14M5 12h14"/></template>
    <template v-else-if="nombre === 'check'"><path d="m5 12.5 4.5 4.5L19 7"/></template>
    <template v-else-if="nombre === 'menu'"><path d="M4 7h16M4 12h16M4 17h16"/></template>
  </svg>
</template>
