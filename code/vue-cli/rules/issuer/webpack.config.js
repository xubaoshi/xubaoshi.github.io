const path = require('path')

module.exports = {
  mode: 'development',
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/',
  },
  node: {
    global: true,
    process: true,
    __filename: 'mock',
    __dirname: 'mock',
  },
  module: {
    rules: [
      {
        loader: 'babel-loader',
        resource: {
          test: /\.js$/,
        },
        issuer: {
          exclude: /printer\.js$/,
        },
      },
      {
        loader: 'raw-loader',
        resource: {
          test: /\.js$/,
        },
        issuer: {
          include: /printer\.js$/,
        },
      },
    ],
  },
}
