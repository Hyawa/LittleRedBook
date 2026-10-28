import { describe, expect, it } from 'vitest'
import { shouldRegisterServiceWorker } from './pwa'

const web = {
  isNative: false,
  isDev: false,
  supportsServiceWorker: true,
}

describe('shouldRegisterServiceWorker', () => {
  it('registra o service worker no build web', () => {
    expect(shouldRegisterServiceWorker(web)).toBe(true)
  })

  it('não registra dentro do aplicativo nativo', () => {
    expect(shouldRegisterServiceWorker({ ...web, isNative: true })).toBe(false)
  })

  it('não registra durante o desenvolvimento', () => {
    expect(shouldRegisterServiceWorker({ ...web, isDev: true })).toBe(false)
  })

  it('não registra quando o navegador não suporta service workers', () => {
    expect(
      shouldRegisterServiceWorker({ ...web, supportsServiceWorker: false }),
    ).toBe(false)
  })
})
