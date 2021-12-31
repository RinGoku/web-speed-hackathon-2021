const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const CopyPlugin = require('copy-webpack-plugin');
const ImageminMozjpeg = require('imagemin-mozjpeg');
const ImageminWebpWebpackPlugin = require('imagemin-webpack-plugin').default;
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const zlib = require('zlib');

const webpack = require('webpack');

const SRC_PATH = path.resolve(__dirname, './src');
const PUBLIC_PATH = path.resolve(__dirname, '../public');
// const PUBLIC_PREV_PATH = path.resolve(__dirname, '../public_prev');

const UPLOAD_PATH = path.resolve(__dirname, '../upload');
const DIST_PATH = path.resolve(__dirname, '../dist');

/** @type {import('webpack').Configuration} */
const config = {
  devServer: {
    historyApiFallback: true,
    host: '0.0.0.0',
    port: 8080,
    proxy: {
      '/api': 'http://localhost:3000',
    },
    static: [PUBLIC_PATH, UPLOAD_PATH],
  },
  entry: {
    main: [
      'core-js',
      'regenerator-runtime/runtime',
      path.resolve(SRC_PATH, './index.css'),
      path.resolve(SRC_PATH, './buildinfo.js'),
      path.resolve(SRC_PATH, './index.jsx'),
    ],
  },
  mode: process.env.WEBPACK_ENV,
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.jsx?$/,
        use: [{ loader: 'babel-loader' }],
      },
      {
        test: /\.css$/i,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader', options: { url: false } },
          { loader: 'postcss-loader' },
        ],
      },
    ],
  },
  output: {
    filename: 'scripts/[name].js',
    path: DIST_PATH,
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.EnvironmentPlugin({
      BUILD_DATE: new Date().toISOString(),
      // Heroku では SOURCE_VERSION 環境変数から commit hash を参照できます
      COMMIT_HASH: process.env.SOURCE_VERSION || '',
      NODE_ENV: 'development',
    }),
    new RemoveEmptyScriptsPlugin(),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].css',
    }),
    new CompressionPlugin({
      filename: '[path][base].gz',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
    new CompressionPlugin({
      filename: '[path][base].br',
      algorithm: 'brotliCompress',
      test: /\.(js|css|html|svg)$/,
      compressionOptions: {
        params: {
          [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
        },
      },
      minRatio: 0.8,
    }),
    new HtmlWebpackPlugin({
      inject: false,
      filename: 'index.html',
      template: path.resolve(SRC_PATH, './index.html'),
    }),
    new CopyPlugin({
      patterns: [
        {
          from: `${PUBLIC_PATH}/images/profiles/*.jpg`,
          to: `${PUBLIC_PATH}/images/profiles/[name].webp`,
        },
      ],
    }),
    new ImageminWebpWebpackPlugin({
      config: [
        {
          test: /\.(png|jpe?g)$/i, // 対象ファイル
          options: {
            quality: 75, // 画質
          },
        },
      ],
    }),
    // new CopyPlugin({
    //   patterns: [
    //     {
    //       from: `${PUBLIC_PREV_PATH}/images`,
    //       to: `${PUBLIC_PATH}/images/[name][ext]`,
    //     },
    //     {
    //       from: `${PUBLIC_PREV_PATH}/images`,
    //       to: `${PUBLIC_PATH}/images/profiles/[name][ext]`,
    //     },
    //     {
    //       from: `${PUBLIC_PREV_PATH}/movies`,
    //       to: `${PUBLIC_PATH}/movies/[name][ext]`,
    //     },
    //   ],
    // }),
    // new ImageminPlugin({
    //   test: /\.(jpe?g|png|gif|svg)$/i,
    //   plugins: [
    //     ImageminMozjpeg({
    //       quality: 85,
    //       progressive: true,
    //     }),
    //   ],
    //   pngquant: {
    //     quality: '70-85',
    //   },
    //   gifsicle: {
    //     interlaced: false,
    //     optimizationLevel: 10,
    //     colors: 256,
    //   },
    //   svgo: {},
    // }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    fallback: {
      fs: false,
      path: false,
    },
  },
  optimization: {
    minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin({})],
  },
  ...(process.env.WEBPACK_ENV === 'development' ? { devtool: 'inline-source-map' } : {}),
};

module.exports = config;
