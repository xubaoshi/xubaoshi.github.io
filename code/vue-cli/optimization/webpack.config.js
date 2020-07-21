const htmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = {
  entry: './src/index.js',
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
      chunks: 'all',
      minSize: 10,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
}
