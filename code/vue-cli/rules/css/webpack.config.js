const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const htmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.vue', '.json'],
  },
  module: {
    rules: [
      // {
      // css-loader 解析 css 模块、style-loader 将解析的 css-loader 插入到页面 head 中
      //   test: /\.css$/,
      //   use: ['style-loader', 'css-loader'],
      // },
      // {
      //   // postcss-loader 可以使用 autoprefixer 针对不同浏览器添加前缀
      //   // 需要配合 package.json 中的 browserslist 及 postcss.config.js
      //   test: /\.css$/,
      //   use: ['style-loader', 'css-loader', 'postcss-loader'],
      // },
      {
        test: /\.css$/,
        oneOf: [
          {
            resourceQuery: /module/,
            use: [
              { loader: 'vue-style-loader' },
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 2,
                  modules: {
                    // 自定义生成的类名
                    localIdentName: '[name]_[local]_[hash:base64:5]',
                  },
                },
              },
              { loader: 'postcss-loader' },
            ],
          },
          {
            resourceQuery: /\?vue/,
            use: [
              { loader: 'vue-style-loader' },
              { loader: 'css-loader', options: { importLoaders: 2 } },
              { loader: 'postcss-loader' },
            ],
          },
          {
            test: /\.module\.\w+$/,
            use: [
              { loader: MiniCssExtractPlugin.loader },
              {
                loader: 'css-loader',
                options: {
                  importLoaders: 2,
                  modules: {
                    // 自定义生成的类名
                    localIdentName: '[name]_[local]_[hash:base64:5]',
                  },
                },
              },
              {
                loader: 'postcss-loader',
              },
            ],
          },
          {
            use: ['style-loader', 'css-loader', 'postcss-loader'],
          },
        ],
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
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new htmlWebpackPlugin({
      template: 'index.html',
      filename: 'index.html',
    }),
    // ... 忽略 vue-loader 插件
    new MiniCssExtractPlugin({
      filename: 'module.css',
    }),
  ],
}
