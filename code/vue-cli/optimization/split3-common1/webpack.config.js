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
      chunks: 'all',
      minChunks: 1,
      minSize: 1,
      maxInitialRequests: 30,
    },
  },
}
