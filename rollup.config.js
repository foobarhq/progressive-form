import resolvePkg from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import sass from 'node-sass';
import postcssModules from 'postcss-modules';
import changeCase from 'change-case';
import getPostcssConfigAsync from 'postcss-load-config';
import deasync from 'deasync';
import { merge } from 'lodash';
import pkg from './package.json';

// force async function to be run synchronously
// this is a hack because rollup-plugin-postcss does not support loading postcssrc files.
const getPostcssConfig = deasync(callback => {
  getPostcssConfigAsync().then(res => callback(null, res), err => callback(err));
});

const postcssConfig = getPostcssConfig();

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

function makeConfig(opts) {
  const cssExportMap = {};

  const localPostcssConfig = {
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
  };

  merge(localPostcssConfig, postcssConfig);

  const config = {
    input: 'src/index.js',
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
        plugins: ['external-helpers'],
      }),
      postcss(localPostcssConfig),
      commonjs({
        sourceMap: false,
      }),
    ],
  };

  merge(config, opts);

  return config;
}

export default [
  makeConfig({
    output: {
      file: 'dist/bundle.es.js',
      format: 'es',
    },
  }),
  makeConfig({
    output: {
      file: 'dist/bundle.cjs.js',
      format: 'cjs',
    },
  }),
];
