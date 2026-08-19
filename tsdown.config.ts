/**
 * Standalone tsdown config for dsh-message-card — emits two artifacts:
 *  - lib/index.js: the Host half (ESM) the loader mounts; registers the
 *    `show_message_card` tool and the `mc_submit` RPC.
 *  - lib/client.js: the browser half (CJS closure) served by dsh-client-modules
 *    into window.__DSH_BOOT__; renders the settings page + conversation cards.
 *
 * The client bundle inlines all local code and treats the platform seed
 * modules (`react` family) as externals answered by the shell's loader.
 */
import { readFile } from 'node:fs/promises'
import type { UserConfig } from 'tsdown'

const PLUGIN_ID = 'dsh-message-card'

const PLATFORM_MODULES = ['react', 'react/jsx-runtime'] as const
const EXTERNALS: readonly string[] = [...PLATFORM_MODULES]

export default [
  {
    name: `${PLUGIN_ID}/node`,
    entry: ['src/index.ts'],
    outDir: 'lib',
    format: ['esm'],
    platform: 'node',
    target: 'es2024',
    fixedExtension: false,
    dts: false,
    clean: false
  },
  {
    name: `${PLUGIN_ID}/client`,
    entry: { client: 'src/client/index.ts' },
    outDir: 'lib',
    format: 'cjs',
    platform: 'browser',
    dts: false,
    sourcemap: true,
    clean: false,
    external: [...EXTERNALS],
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV ?? 'production')
    },
    noExternal: (id: string) => (EXTERNALS.includes(id) ? undefined : true),
    plugins: [{
      name: 'dsh-inline-css',
      resolveId(source: string) {
        return source.endsWith('.module.css') ? `\0dsh-css:${source}` : null
      },
      load(id: string) {
        if (!id.startsWith('\0dsh-css:')) return null
        return ''
      }
    }],
    outputOptions: {
      entryFileNames: 'client.js',
      banner: `window.__ModuleLoader__.load({ id: ${JSON.stringify(PLUGIN_ID)}, factory: (require) => {`,
      footer: 'return module.exports; } });',
      intro: 'var module = { exports: {} }; var exports = module.exports;'
    }
  }
] satisfies UserConfig[]
