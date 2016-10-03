import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';

export default {
  dest: 'dist/index.js',
  entry: 'src/index.js',
  format: 'cjs',
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    commonjs(),
    resolve({
      browser: true,
      jsnext: true,
      main: true,
    }),
    uglify(),
  ],
  sourceMap: true,
};
