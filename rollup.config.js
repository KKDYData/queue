import typescript from 'rollup-plugin-typescript2'
import clear from 'rollup-plugin-clear'

const output = [
  {
    file: `lib/index.esm.js`,
    format: 'esm',
  },
  {
    file: `lib/index.cjs.js`,
    format: 'cjs',
  },
]

const plugins = [
  clear({
    targets: ['lib'],
    watch: true,
  }),
  typescript({
    tsconfig: 'tsconfig.json',
  }),
]

export default {
  input: 'src/index.ts',
  output,
  plugins,
}
