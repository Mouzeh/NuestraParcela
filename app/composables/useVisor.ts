// Estado compartido del visor de fotos: cualquier sección puede abrirlo en una foto.
export const useVisor = () => {
  const activa = useState<number | null>('visor-activa', () => null)
  const abrir = (indice = 0) => (activa.value = indice)
  const cerrar = () => (activa.value = null)
  return { activa, abrir, cerrar }
}
