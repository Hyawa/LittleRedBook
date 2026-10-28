import { describe, expect, it, vi } from 'vitest'
import { syncSystemBars, type SystemBarsPort } from './systemBars'

function fakePort() {
  const setStyle = vi
    .fn<SystemBarsPort['setStyle']>()
    .mockResolvedValue(undefined)
  return { port: { setStyle }, setStyle }
}

describe('syncSystemBars', () => {
  it('usa ícones claros quando o tema do app é escuro', async () => {
    const { port, setStyle } = fakePort()

    await syncSystemBars(port, true)

    expect(setStyle).toHaveBeenCalledWith({ style: 'DARK' })
  })

  it('usa ícones escuros quando o tema do app é claro', async () => {
    const { port, setStyle } = fakePort()

    await syncSystemBars(port, false)

    expect(setStyle).toHaveBeenCalledWith({ style: 'LIGHT' })
  })

  it('não faz nada no navegador, onde não existe barra nativa', async () => {
    await expect(syncSystemBars(null, true)).resolves.toBeUndefined()
  })

  it('ignora falhas do plugin nativo', async () => {
    const port: SystemBarsPort = {
      setStyle: vi.fn().mockRejectedValue(new Error('plugin indisponível')),
    }

    await expect(syncSystemBars(port, false)).resolves.toBeUndefined()
  })
})
