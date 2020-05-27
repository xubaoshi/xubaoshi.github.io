const path = require('path')

module.exports = {
  // 1. no context
  // entry: path.join(__dirname, '../src/index.js'),
  // 2. has context
  // entry: './index.js',

  // object entry
  // entry: {
  //   main: ['./index.js'],
  // },

  // mutli entry
  // entry: {
  //   main: ['./index.js'],
  //   test: ['./test1.js'],
  // },

  // combined entry
  entry: {
    main: ['./index.js', './test1.js'],
  },

  context: path.resolve(__dirname, '../src'),
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].js',
    publicPath: '/dist/',
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
