import pkg from './package.json'
import rpi_jsy from 'rollup-plugin-jsy-lite'
import {terser as rpi_terser} from 'rollup-plugin-terser'

export default [
  { input: 'code/mini-source-map.jsy',
    output: [
      { file: pkg.module, format: 'esm' },
      { file: pkg.main, format: 'cjs', exports:'named' },
    ],
    plugins: [rpi_jsy()],
  },

  { input: 'code/mini-source-map.jsy',
    output: [
      { file: pkg.module.replace(/\.mjs/, '.min.mjs'), format: 'esm' },
      { file: pkg.browser, format: 'umd', name: pkg.name, exports:'named' },
    ],
    plugins: [rpi_jsy(), rpi_terser()],
  },
]
