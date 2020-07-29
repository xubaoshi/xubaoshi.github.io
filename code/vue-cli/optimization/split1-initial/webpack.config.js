const htmlWebpackPlugin = require('html-webpack-plugin')
let BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    entry1: './src/entry1.js',
    entry2: './src/entry2.js',
    entry3: './src/entry3.js',
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name].js',
  },
  plugins: [
    new htmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index1.html',
      chunks: ['entry1'],
    }),
    new htmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index2.html',
      chunks: ['entry2'],
    }),
    new htmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index3.html',
      chunks: ['entry3'],
    }),
    new BundleAnalyzerPlugin({
      analyzerPort: 8889,
    }),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          chunks: 'initial',
          name: 'chunk-vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        default: {
          chunks: 'initial',
          name: 'chunk-common',
          minChunks: 2,
          minSize: 0,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
}
