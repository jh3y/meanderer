import resolve from '@rollup/plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import { uglify } from 'rollup-plugin-uglify'
import filesize from 'rollup-plugin-filesize'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/meanderer.min.js',
    format: 'umd',
    name: 'Meanderer',
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**', // only transpile our source code
    }),
    uglify(),
    filesize(),
  ],
}
