const htmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
  entry: {
    entry: './src/index.js',
    entry1: './src/index1.js',
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: '[name].js',
  },
  plugins: [
    new htmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
  ],
  optimization: {
    splitChunks: {
      minSize: 20,
      cacheGroups: {
        vendors: {
          name: 'chunk-vendors',
          chunks: 'initial',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        default: {
          name: 'chunk-common',
          chunks: 'initial',
          name: 'chunk-common',
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
}
