const path = require('path')

module.exports = {
  mode: 'development',
  entry: path.join(__dirname, 'src/index1.js'),
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
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg)$/,
        loader: 'url-loader',
        options: {
          limit: 3000,
          name: '[name].[hash:8].[ext]',
        },
      },
    ],
  },
}
