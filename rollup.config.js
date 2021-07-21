import pkg from './package.json'
import {terser as rpi_terser} from 'rollup-plugin-terser'

export default [
  { input: 'code/tiny-source-map.mjs',
    output: [
      { file: pkg.module, format: 'esm' },
      { file: pkg.main, format: 'cjs', exports:'named' },
    ],
    plugins: [],
  },

  { input: 'code/tiny-source-map.mjs',
    output: [
      { file: pkg.module.replace(/\.mjs/, '.min.mjs'), format: 'esm' },
      { file: pkg.browser, format: 'umd', name: pkg.name, exports:'named' },
    ],
    plugins: [rpi_terser()],
  },
]
