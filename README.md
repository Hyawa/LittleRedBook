# Citações — Livro Vermelho

Aplicativo de leitura mobile-first com o texto integral em português de
**Citações do Presidente Mao Zedong** — 33 seções e 427 citações — feito para
funcionar **offline**. Pode ser instalado como PWA no navegador ou empacotado
como **aplicativo Android** (APK) com Capacitor.

A interface parte da estética do próprio livro: capa vermelho-profunda, detalhes
em dourado, papel creme e tipografia editorial. O texto é o mesmo da edição
brasileira de 1972, transcrita pelo Marxists Internet Archive.

## Recursos

- **Leitura integral** das 33 seções, com listas numeradas preservadas.
- **Citação do dia** determinística, uma para cada dia do ano.
- **Busca offline** sem acentos, com múltiplos termos, trechos destacados e
  atribuições incluídas.
- **Salvos** no próprio dispositivo, agrupados por seção.
- **Progresso de leitura**: seções concluídas, percentual e retomada automática.
- **Leitor confortável**: três temas (Papel, Claro, Escuro), tamanho de texto de
  16 a 26 px e barra de progresso de rolagem.
- **Copiar e partilhar** qualquer citação (Web Share API com fallback para a
  área de transferência).
- **Links diretos** para uma citação (`#/secoes/17?c=3`), com destaque temporário.
- **PWA instalável** com service worker e precache de todo o conteúdo.
- **App Android** com ícone adaptativo, splash screen e leitura offline dentro do
  WebView, sem depender do service worker.
- **Acessibilidade**: navegação por teclado, rótulos ARIA, foco visível, alvos de
  toque de pelo menos 44 px e respeito a `prefers-reduced-motion`.

## Stack

| Camada        | Escolha                                              |
| ------------- | ---------------------------------------------------- |
| Build         | Vite 8 + React 19 + TypeScript 6                     |
| Estilo        | Tailwind CSS v4 (`@tailwindcss/vite`)                |
| Componentes   | shadcn/ui sobre Radix UI + `lucide-react`            |
| Notificações  | Sonner                                               |
| PWA           | `vite-plugin-pwa` (Workbox `generateSW`, auto-update)|
| App nativo    | Capacitor 8 (Android, `minSdk` 24 / `targetSdk` 36)   |
| Ícones        | `sharp` (PWA) + `@capacitor/assets` (Android)         |
| Testes        | Vitest (regras de domínio)                           |

As fontes **Crimson Pro**, **Cormorant Garamond** e **Cinzel** são
auto-hospedadas em `src/assets/fonts` (WOFF2), para que a tipografia também
funcione sem internet.

## Como rodar

Requisitos: Node 20+ e pnpm.

```bash
pnpm install
pnpm dev        # desenvolvimento em http://localhost:5173
pnpm build      # build de produção (dist/)
pnpm preview    # serve o build em http://localhost:4173
```

Para testar a instalação e o modo offline, use `pnpm build && pnpm preview`,
abra o app, aguarde o service worker instalar e recarregue. Depois disso o
conteúdo inteiro abre sem rede.

## Android (APK)

Requisitos:

- **JDK 21+** — o JBR que vem com o Android Studio serve.
- **Android SDK** com a plataforma 36 e as build-tools mais recentes.
- `JAVA_HOME` e `ANDROID_HOME` configurados (o script também procura o JBR e o
  SDK nos caminhos padrão do Windows).

Para gerar o APK de depuração de uma vez:

```bash
pnpm apk
```

O comando executa `pnpm build`, `cap sync android` e
`android/gradlew assembleDebug`. No fim, imprime o caminho e o tamanho do APK:

```
android/app/build/outputs/apk/debug/app-debug.apk
```

Instale em um aparelho conectado por USB (com depuração ativada):

```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

Passos separados, úteis durante o desenvolvimento:

```bash
pnpm cap:sync     # build web + copia dist/ para o projeto Android
pnpm cap:open     # abre o projeto no Android Studio
pnpm cap:assets   # regenera ícones e splash screens a partir de assets/*.svg
```

### Ícone e splash screen

Os recursos nativos são gerados a partir de SVGs em `assets/`:

| Arquivo               | Uso                                        |
| --------------------- | ------------------------------------------ |
| `icon-only.svg`       | ícone tradicional (Android 7 e anteriores) |
| `icon-foreground.svg` | frente do ícone adaptativo (Android 8+)    |
| `icon-background.svg` | fundo do ícone adaptativo                  |
| `splash.svg`          | splash screen clara                        |
| `splash-dark.svg`     | splash screen escura                       |

A paleta é a do livro: vermelho `#8e1118`, dourado `#ecd39a` e creme `#f7f0e2`.
Depois de editar um SVG, rode `pnpm cap:assets` para regravar as 74 imagens em
`android/app/src/main/res/`.

### Assinatura

`pnpm apk` gera um APK **debug**, assinado com a chave de depuração — ótimo para
testar no aparelho, mas não para publicar. Para uma versão de distribuição, crie
um keystore e configure `signingConfigs` em `android/app/build.gradle`, ou use
**Build → Generate Signed Bundle / APK** no Android Studio.

Dentro do app nativo o service worker é desativado de propósito: os arquivos já
são locais e um cache antigo impediria o app de receber atualizações novas. No
navegador (PWA), ele continua ativo. O app é bloqueado em orientação retrato e
respeita as áreas seguras (notch e barra de gestos).

## Conteúdo

- Fonte: [Marxists Internet Archive — Citações do Presidente Mao
  Zedong](https://www.marxists.org/portugues/mao/1966/citas/index.htm)
- Edição de referência: Pequim, Edições em Línguas Estrangeiras, 1972.
- Total: **33 seções / 427 citações** — o mesmo total do original.
- Arquivo consumido pelo app: `src/data/quotes.json` (~299 KB; ~100 KB gzip).
- O scraper é reproduzível:

```bash
pnpm fetch:quotes   # baixa, analisa e regrava src/data/quotes.json
```

As páginas originais ficam em `scripts/.cache` (ignorado pelo git). O parser
preserva parágrafos e listas (`<ol>`/`<ul>`), normaliza a atribuição de cada
citação e corrige um erro de digitação no título da seção II.

Modelo de dados (ver `src/lib/types.ts`):

```ts
type TextBlock =
  | { type: 'p'; text: string }
  | { type: 'ol' | 'ul'; items: string[] }

interface Quote {
  id: number
  number: number
  blocks: TextBlock[]
  source: string
}
```

## Offline e instalação

O build precacheia HTML, CSS, JS, fontes, ícones e o JSON de citações
(~1 MB no total). A busca e os salvos rodam inteiramente no cliente.

- **Android/Chrome**: menu do navegador → “Instalar aplicativo” (ou o botão em
  Ajustes).
- **iPhone/iPad (Safari)**: Compartilhar → “Adicionar à Tela de Início”.
- **Desktop**: ícone de instalação na barra de endereço.

Depois da primeira visita, o app abre e funciona sem conexão. Os dados de
leitura ficam em `localStorage`:

| Chave                   | Conteúdo                                  |
| ----------------------- | ----------------------------------------- |
| `citacoes:library:v1`   | citações salvas, seções lidas, última leitura |
| `citacoes:settings:v1`  | tema e tamanho do texto                   |

O volume de dados é pequeno (alguns kilobytes), então `localStorage` resolve
bem. Se no futuro for necessário guardar anotações, histórico de busca ou
sincronização, a preferência do projeto é **SQLite** — no Android, via
`@capacitor-community/sqlite`.

## Estrutura

```
src/
  components/       UI e peças de leitura (capa, cartões, navegação, ajustes)
  components/ui/    componentes shadcn/ui (button, sheet, slider, sonner…)
  data/quotes.json  conteúdo offline
  hooks/            rota por hash, instalação PWA, status de rede, título
  lib/              domínio testado: busca, citação do dia, progresso, rotas
  pages/            Hoje, Seções, Leitor, Buscar, Salvos
  state/            contextos de biblioteca e preferências
  index.css         tokens, temas, tipografia, textura de papel
android/            projeto Android gerado pelo Capacitor (Gradle)
assets/             SVGs de ícone e splash usados por @capacitor/assets
scripts/
  fetch-quotes.mjs  scraper/parser do conteúdo
  generate-icons.mjs gerador dos ícones PWA
  build-apk.mjs     build web + sync + gradlew assembleDebug
capacitor.config.ts appId, nome e configuração do WebView nativo
```

## Scripts

| Comando             | O que faz                                      |
| ------------------- | ---------------------------------------------- |
| `pnpm dev`          | servidor de desenvolvimento                    |
| `pnpm build`        | typecheck + build de produção                  |
| `pnpm preview`      | serve o build de produção                      |
| `pnpm test`         | testes de domínio (Vitest)                     |
| `pnpm test:watch`   | testes em modo watch                           |
| `pnpm typecheck`    | `tsc -b`                                       |
| `pnpm lint`         | ESLint                                         |
| `pnpm fetch:quotes` | rebaixa e reprocessa as citações               |
| `pnpm icons`        | regenera favicon e ícones PWA                  |
| `pnpm cap:sync`     | build + copia o `dist/` para o projeto Android |
| `pnpm cap:open`     | abre o projeto Android no Android Studio       |
| `pnpm cap:assets`   | regenera ícones e splash screens do Android    |
| `pnpm apk`          | gera o APK de depuração com `gradlew`          |

## Decisões de design

- **Mobile-first**: navegação inferior fixa no celular e pill flutuante no
  desktop; o leitor esconde a navegação para dar prioridade ao texto.
- **Cores**: vermelho de capa `#8e1118`, dourado `#b58a2b` e papel `#f7f0e2`,
  com variantes para os temas Claro e Escuro.
- **Tipografia**: Cormorant Garamond nos títulos, Crimson Pro na leitura e
  Cinzel nos rótulos em caixa alta.
- **Um só build**: o mesmo `dist/` alimenta o PWA e o APK; o service worker só
  é registrado no navegador, para o app nativo nunca servir um bundle antigo.
- **Persistência local**: nenhum servidor, conta ou telemetria.
- **Conteúdo histórico**: o app não endossa o conteúdo; é uma edição de leitura
  do texto publicado, útil para estudo e pesquisa.

## Licenças

- Código do aplicativo: uso livre neste repositório.
- Fontes: SIL Open Font License 1.1 — textos em
  `src/assets/fonts/OFL-*.txt`.
- Texto das citações: transcrição do Marxists Internet Archive; consulte a
  fonte para informações de direitos e citação.
