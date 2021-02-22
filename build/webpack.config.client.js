'use strict';

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const paths = require('./paths');
const baseConfig = require('./webpack.config.base');
const getClientEnvironment = require('./env');

const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1));

const isEnvDevelopment = process.env.NODE_ENV === 'development';
const isEnvProduction = process.env.NODE_ENV === 'production';
const shouldUseSourceMap = isEnvDevelopment || process.env.GENERATE_SOURCEMAP;

// Variable used for enabling profiling in Production
// passed into alias object. Uses a flag if passed into the build command
const isEnvProductionProfile = isEnvProduction && process.argv.includes('--profile');

const devtool = isEnvDevelopment
  ? 'cheap-module-source-map'
  : shouldUseSourceMap
  ? 'source-map'
  : false;

// Get the path to the uncompiled service worker (if it exists).
const swSrc = paths.swSrc;

const optimization = {
  minimize: isEnvProduction,
  minimizer: [
    // This is only used in production mode
    new TerserPlugin({
      terserOptions: {
        parse: {
          // We want terser to parse ecma 8 code. However, we don't want it
          // to apply any minification steps that turns valid ecma 5 code
          // into invalid ecma 5 code. This is why the 'compress' and 'output'
          // sections only apply transformations that are ecma 5 safe
          // https://github.com/facebook/create-react-app/pull/4234
          ecma: 8,
        },
        compress: {
          ecma: 5,
          warnings: false,
          // Disabled because of an issue with Uglify breaking seemingly valid code:
          // https://github.com/facebook/create-react-app/issues/2376
          // Pending further investigation:
          // https://github.com/mishoo/UglifyJS2/issues/2011
          comparisons: false,
          // Disabled because of an issue with Terser breaking valid code:
          // https://github.com/facebook/create-react-app/issues/5250
          // Pending further investigation:
          // https://github.com/terser-js/terser/issues/120
          inline: 2,
        },
        mangle: {
          safari10: true,
        },
        // Added for profiling in devtools
        keep_classnames: isEnvProductionProfile,
        keep_fnames: isEnvProductionProfile,
        output: {
          ecma: 5,
          comments: false,
          // Turned on because emoji and regex is not minified properly using default
          // https://github.com/facebook/create-react-app/issues/2488
          ascii_only: true,
        },
      },
      // Use multi-process parallel running to improve the build speed
      // Default number of concurrent runs: os.cpus().length - 1
      // Disabled on WSL (Windows Subsystem for Linux) due to an issue with Terser
      // https://github.com/webpack-contrib/terser-webpack-plugin/issues/21
      parallel: true,
      // Enable file caching
      cache: true,
      sourceMap: shouldUseSourceMap,
    }),
    new OptimizeCSSAssetsPlugin({
      cssProcessorOptions: {
        parse: safePostCssParser,
        map: shouldUseSourceMap
          ? {
              // `inline: false` forces the sourcemap to be output into a
              // separate file
              inline: false,
              // `annotation: true` appends the sourceMappingURL to the end of
              // the css file, helping the browser find the sourcemap
              annotation: true,
            }
          : false,
      },
      cssProcessorPluginOptions: {
        preset: ['default', { minifyFontValues: { removeQuotes: false } }],
      },
    }),
  ],
  splitChunks: {
    // Automatically split vendor and commons
    // https://twitter.com/wSokra/status/969633336732905474
    // https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
    chunks: 'all',
    // minSize: 30000,
    // minChunks: 1,
    // automaticNameDelimiter: '.',
    name: false,
    cacheGroups: {
      vendors: {
        test: module => {
          return (
            module.resource &&
            /\.js$/.test(module.resource) &&
            module.resource.match('node_modules')
          );
        },
        name: 'vendor',
      },
    },
  },
  runtimeChunk: true,
};

const plugins = [
  // Makes some environment variables available to the JS code, for example:
  // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
  // It is absolutely essential that NODE_ENV is set to production
  // during a production build.
  // Otherwise React will be compiled in the very slow development mode.
  new webpack.DefinePlugin({
    ...env.stringified,
    __isBrowser__: true, // eslint-disable-line
  }),
  new ManifestPlugin({
    fileName: 'asset-manifest.json',
    publicPath: '/',
  }),
  new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
  new ESLintPlugin({
    // Plugin options
    extensions: ['js', 'jsx', 'ts', 'tsx'],
    // formatter: require.resolve('react-dev-utils/eslintFormatter'),
    eslintPath: require.resolve('eslint'),
    context: paths.appSrc,
    cache: false,
    // ESLint class options
    cwd: paths.appPath,
    resolvePluginsRelativeTo: __dirname,
    baseConfig: {
      extends: [require.resolve('eslint-config-react-app/base')],
    },
  }),
  process.env.use_analyzer &&
    new BundleAnalyzerPlugin({
      analyzerMode: 'server',
      analyzerHost: '127.0.0.1',
      analyzerPort: 8889,
      reportFilename: 'report.html',
      defaultSizes: 'parsed',
      openAnalyzer: true,
      generateStatsFile: false,
      statsFilename: 'stats.json',
      statsOptions: null,
      logLevel: 'info',
    }),
];

module.exports = merge(baseConfig, {
  devtool: devtool,
  entry: {
    Page: ['@babel/polyfill', paths.entry],
  },
  resolve: {
    alias: {
      // for this issue https://github.com/ykfe/egg-react-ssr/issues/36
      'react-router': require.resolve('react-router'),
    },
  },
  output: {
    path: paths.appBuild,
    pathinfo: true,
    publicPath: paths.publicUrlOrPath,
    filename: 'static/js/[name].js',
    chunkFilename: 'static/js/[name].chunk.js',
    hotUpdateChunkFilename: '[hash].hot-update.js',
    hotUpdateMainFilename: '[hash].hot-update.json',
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
  },
  optimization: optimization,
  plugins: plugins.filter(Boolean),
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
});
