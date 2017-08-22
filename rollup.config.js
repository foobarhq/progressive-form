import resolvePkg from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import sass from 'node-sass';
import postcssModules from 'postcss-modules';
import changeCase from 'change-case';
import pkg from './package.json';

function preprocessor(content, id) {
  return new Promise((resolve, reject) => {
    sass.render({
      file: id,
    }, (err, result) => {
      if (err) {
        return void reject(err);
      }

      resolve({
        code: result.css.toString(),
        map: result.map,
      });
    });
  });
}

const cssExportMap = {};

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'es',
  },
  external: Object.keys(pkg.peerDependencies),
  plugins: [
    resolvePkg({
      jsnext: true,
      module: true,
      main: true,
      jail: '/src',
    }),
    babel({
      exclude: ['node_modules/**', '**/*.scss'],
    }),
    postcss({
      preprocessor,
      extensions: ['.scss'],
      extract: 'dist/bundle.css',
      plugins: [
        postcssModules({
          getJSON(id, exportTokens) {
            const tokens = {};
            for (const key of Object.keys(exportTokens)) {
              tokens[key] = exportTokens[key];
              tokens[changeCase.camelCase(key)] = exportTokens[key];
            }

            cssExportMap[id] = tokens;
          },
          generateScopedName: 'progressive-form__[local]',
        }),
      ],
      getExportNamed: false,
      getExport(id) {
        return cssExportMap[id];
      },
    }),
    commonjs({
      sourceMap: false,
    }),
  ],
};
