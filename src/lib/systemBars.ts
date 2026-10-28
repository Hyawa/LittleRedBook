import { Capacitor, registerPlugin } from '@capacitor/core'

export type SystemBarStyle = 'LIGHT' | 'DARK'

export interface SystemBarsPort {
  setStyle(options: { style: SystemBarStyle }): Promise<void>
}

/**
 * No Capacitor, `LIGHT` descreve uma barra de fundo claro — ou seja, ícones
 * escuros. O tema escuro do app pede o contrário.
 */
export function systemBarStyle(isDark: boolean): SystemBarStyle {
  return isDark ? 'DARK' : 'LIGHT'
}

export async function syncSystemBars(
  port: SystemBarsPort | null,
  isDark: boolean,
): Promise<void> {
  if (!port) return
  try {
    await port.setStyle({ style: systemBarStyle(isDark) })
  } catch {
    /* a barra nativa é um detalhe visual: nunca deve quebrar a leitura */
  }
}

let nativePort: SystemBarsPort | null = null

export function getNativeSystemBars(): SystemBarsPort | null {
  if (!Capacitor.isNativePlatform()) return null
  nativePort ??= registerPlugin<SystemBarsPort>('SystemBars')
  return nativePort
}
