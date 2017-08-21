/* eslint-disable import/no-commonjs */

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const cssLoader = {
  loader: 'css-loader',
  options: {
    importLoaders: 2,
    localIdentName: 'progressive-form__[local]',
    modules: true,
    camelCase: true,
  },
};

module.exports = {
  context: __dirname,
  devtool: 'source-map',
  target: 'web',
  entry: {
    example: './example/index.js',
  },
  output: {
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'example'),
        ],
        loader: 'babel-loader',
        test: /\.jsx?$/,
      }, {
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'example'),
        ],
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [cssLoader, 'postcss-loader', 'sass-loader'],
        }),
        test: /\.scss$/,
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin('[name].css'),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
  ],
  resolve: {
    modules: ['node_modules'],
    extensions: ['.js', '.jsx'],
  },
};
