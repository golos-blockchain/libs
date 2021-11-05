'use strict';
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const _ = require('lodash');
const path = require('path');
const webpack = require('webpack');

const DEFAULTS = {
  isDevelopment: process.env.NODE_ENV !== 'production',
  baseDir: path.join(__dirname, '..'),
};

function makePlugins(options) {
  const isDevelopment = options.isDevelopment;

  let plugins = [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'stats.html',
      openAnalyzer: false,
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
  ];

  if (!isDevelopment) {
    plugins = plugins.concat([
      new webpack.optimize.AggressiveMergingPlugin(),
    ]);
  }

  return plugins;
}

function makeConfig(options) {
  if (!options) options = {};
  _.defaults(options, DEFAULTS);

  const isDevelopment = options.isDevelopment;

  return {
    mode: isDevelopment ? 'development' : 'production',
    devtool: isDevelopment ? 'cheap-eval-source-map' : 'source-map',
    entry: {
      golos: path.join(options.baseDir, 'src/browser.js'),
      'golos-tests': path.join(options.baseDir, 'test/api.test.js'),
    },
    output: {
      filename: '[name].min.js',
    },
    plugins: makePlugins(options),
    module: {
      rules: [
        {
          test: /\.js?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
      ],
    },
    resolve: {
      fallback: {
        assert: require.resolve('assert'),
        stream: require.resolve('stream-browserify'),
      }
    },
  };
}

if (!module.parent) {
  console.log(makeConfig({
    isDevelopment: process.env.NODE_ENV !== 'production',
  }));
}

exports = module.exports = makeConfig;
exports.DEFAULTS = DEFAULTS;
