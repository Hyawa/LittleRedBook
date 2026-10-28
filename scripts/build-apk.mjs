#!/usr/bin/env node
/**
 * Gera o APK de depuração do aplicativo Android.
 *
 * Uso: pnpm apk
 *
 * Requisitos:
 *   - JDK 21+ (o JBR que acompanha o Android Studio serve)
 *   - Android SDK com a plataforma 36
 *
 * O script apenas orquestra os passos que também podem ser rodados à mão:
 *   pnpm build && pnpm exec cap sync android
 *   cd android && gradlew assembleDebug
 */
import { spawnSync } from 'node:child_process'
import { existsSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const androidDir = path.join(root, 'android')
const apkPath = path.join(
  androidDir,
  'app',
  'build',
  'outputs',
  'apk',
  'debug',
  'app-debug.apk',
)
const isWindows = process.platform === 'win32'
const javaBinary = isWindows ? 'java.exe' : 'java'

function fail(message) {
  console.error(`\n✖ ${message}\n`)
  process.exit(1)
}

function resolveJavaHome() {
  const candidates = [
    process.env.JAVA_HOME,
    isWindows &&
      'C:\\Program Files\\Android\\Android Studio\\jbr',
    isWindows && 'C:\\Program Files\\Java\\jdk-21',
  ].filter(Boolean)

  for (const candidate of candidates) {
    if (existsSync(path.join(candidate, 'bin', javaBinary))) return candidate
  }

  fail(
    'JDK 21 não encontrado. Instale o Android Studio (ele inclui o JBR) ou um JDK 21+ e defina JAVA_HOME.\n' +
      '  Exemplo: JAVA_HOME="C:\\Program Files\\Android\\Android Studio\\jbr"',
  )
}

function javaMajorVersion(javaHome) {
  const result = spawnSync(path.join(javaHome, 'bin', javaBinary), ['-version'], {
    encoding: 'utf8',
    windowsHide: true,
  })
  const output = `${result.stderr ?? ''}${result.stdout ?? ''}`
  const match = output.match(/version "(?:1\.)?(\d+)/)
  return match ? Number(match[1]) : 0
}

function resolveAndroidSdk() {
  const candidates = [
    process.env.ANDROID_HOME,
    process.env.ANDROID_SDK_ROOT,
    isWindows && process.env.LOCALAPPDATA
      ? path.join(process.env.LOCALAPPDATA, 'Android', 'Sdk')
      : null,
  ].filter(Boolean)

  for (const candidate of candidates) {
    if (existsSync(path.join(candidate, 'platforms'))) return candidate
  }

  fail(
    'Android SDK não encontrado. Instale o SDK pelo Android Studio (SDK Manager) e defina ANDROID_HOME.\n' +
      '  Exemplo: ANDROID_HOME="%LOCALAPPDATA%\\Android\\Sdk"',
  )
}

function run(label, command, args, options = {}) {
  console.log(`\n▸ ${label}`)

  const result = isWindows
    ? spawnSync(
        process.env.ComSpec ?? 'cmd.exe',
        ['/d', '/s', '/c', [command, ...args].join(' ')],
        { stdio: 'inherit', ...options },
      )
    : spawnSync(command, args, { stdio: 'inherit', ...options })

  if (result.error) {
    fail(`Não foi possível executar "${command}": ${result.error.message}`)
  }
  if (result.status !== 0) {
    fail(
      `${label} falhou (código ${result.status ?? 'desconhecido'}).\n` +
        '  Dica: rode o comando acima manualmente para ver o erro completo do Gradle.',
    )
  }
}

console.log('Citações — APK Android (depuração)')

const javaHome = resolveJavaHome()
const javaVersion = javaMajorVersion(javaHome)
if (javaVersion < 21) {
  fail(
    `O Capacitor 8 exige JDK 21+, mas o JAVA_HOME aponta para Java ${javaVersion || 'desconhecido'}.\n` +
      '  Use o JBR do Android Studio, por exemplo:\n' +
      '  JAVA_HOME="C:\\Program Files\\Android\\Android Studio\\jbr"',
  )
}

const androidSdk = resolveAndroidSdk()
if (!existsSync(androidDir)) {
  fail(
    'A pasta android/ não existe. Rode "pnpm exec cap add android" para gerar o projeto nativo.',
  )
}

const env = {
  ...process.env,
  JAVA_HOME: javaHome,
  ANDROID_HOME: androidSdk,
  ANDROID_SDK_ROOT: androidSdk,
  PATH: `${path.join(javaHome, 'bin')}${path.delimiter}${process.env.PATH ?? ''}`,
}

console.log(`  JAVA_HOME    ${javaHome} (Java ${javaVersion})`)
console.log(`  ANDROID_HOME ${androidSdk}`)

run('1/3 Build web (Vite)', 'pnpm', ['build'], { cwd: root, env })
run('2/3 Sincronizar com o Android (Capacitor)', 'pnpm', [
  'exec',
  'cap',
  'sync',
  'android',
], { cwd: root, env })

const gradlew = isWindows ? 'gradlew.bat' : './gradlew'
run('3/3 Compilar o APK (Gradle)', gradlew, ['assembleDebug'], {
  cwd: androidDir,
  env,
})

if (!existsSync(apkPath)) {
  fail(`O Gradle terminou, mas o APK não foi encontrado em ${apkPath}.`)
}

const sizeMb = (statSync(apkPath).size / (1024 * 1024)).toFixed(1)
console.log(`\n✔ APK gerado (${sizeMb} MB):\n  ${apkPath}`)
console.log(
  `\nInstalar em um aparelho conectado:\n  adb install -r "${apkPath}"`,
)
