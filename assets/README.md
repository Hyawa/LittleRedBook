# Ícones e splash do aplicativo

Fontes vetoriais usadas por `pnpm cap:assets` (via `@capacitor/assets`) para
gerar os recursos nativos do Android.

| Arquivo               | Uso                                              |
| --------------------- | ------------------------------------------------ |
| `icon-only.svg`       | ícone tradicional (legado) e fallback            |
| `icon-foreground.svg` | camada da frente do ícone adaptativo (Android 8+) |
| `icon-background.svg` | camada de fundo do ícone adaptativo              |
| `splash.svg`          | splash screen clara                              |
| `splash-dark.svg`     | splash screen escura                             |

Paleta: vermelho `#8e1118`, dourado `#ecd39a` e creme `#f7f0e2`.

Para regenerar:

```bash
pnpm cap:assets
```
