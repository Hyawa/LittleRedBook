import { Capacitor } from '@capacitor/core'

export interface PwaEnvironment {
  isNative: boolean
  isDev: boolean
  supportsServiceWorker: boolean
}

/**
 * O service worker só faz sentido no navegador. Dentro do Capacitor o WebView
 * já carrega os arquivos locais, e um cache antigo atrapalharia as atualizações.
 */
export function shouldRegisterServiceWorker({
  isNative,
  isDev,
  supportsServiceWorker,
}: PwaEnvironment): boolean {
  return !isNative && !isDev && supportsServiceWorker
}

export async function registerPwa(): Promise<void> {
  const isNative = Capacitor.isNativePlatform()
  const supportsServiceWorker = 'serviceWorker' in navigator

  const enabled = shouldRegisterServiceWorker({
    isNative,
    isDev: import.meta.env.DEV,
    supportsServiceWorker,
  })

  if (!enabled) {
    if (isNative && supportsServiceWorker) {
      const registrations = await navigator.serviceWorker.getRegistrations()
      await Promise.all(
        registrations.map((registration) => registration.unregister()),
      )
    }
    return
  }

  const { registerSW } = await import('virtual:pwa-register')
  registerSW({ immediate: true })
}
