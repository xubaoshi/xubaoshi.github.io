const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.vue', '.json', '.pug'],
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
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'cache-loader',
            options: {
              cacheDirectory: path.resolve(
                __dirname,
                'node_modules/.cache/vue-loader'
              ),
              cacheIdentifier: 'test',
            },
          },
          {
            loader: 'vue-loader',
            options: {
              cacheDirectory: path.resolve(
                __dirname,
                'node_modules/.cache/vue-loader'
              ),
              cacheIdentifier: 'test',
            },
          },
        ],
      },
      {
        test: /\.pug$/,
        oneOf: [
          {
            resourceQuery: /^\?vue/,
            use: ['pug-plain-loader'],
          },
          {
            use: ['raw-loader', 'pug-plain-loader'],
          },
        ],
      },
    ],
  },
  plugins: [new VueLoaderPlugin()],
}
