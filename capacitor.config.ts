import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'br.com.livrovermelho.citacoes',
  appName: 'Citações',
  webDir: 'dist',
  backgroundColor: '#f7f0e2',
  server: {
    androidScheme: 'https',
  },
  android: {
    backgroundColor: '#f7f0e2',
  },
}

export default config
