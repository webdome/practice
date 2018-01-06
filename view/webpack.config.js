const webpack = require('webpack')
const CleanPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
// var DashboardPlugin = require('webpack-dashboard/plugin')
require('./build/watcher.js')
const path = require('path')
var ROOT_PATH = path.resolve(__dirname)
var BUILDS_PATH = path.resolve(ROOT_PATH, 'dist')
var SRC_PATH = path.resolve(ROOT_PATH, "src")
var LIBS_PATH = path.resolve(ROOT_PATH, 'libs')

// process.env.NODE_ENV = 'production' // 生产环境
var production = process.env.NODE_ENV === 'production'

var plugins = [
  // 打包css
  new ExtractTextPlugin({
    filename: 'bundle.css',
    allChunks: true
  }),
  new HtmlWebpackPlugin({  // Also generate a test.html
    filename: 'index.html',
    template: 'src/index.html'
  }),
  // 提取相同依赖
  // new webpack.optimize.CommonsChunkPlugin({
  //   name: 'main', // 将依赖移到我们的主文件
  //   children: true, // 在所有被拆分的代码块中寻找共同的依赖关系
  //   minChunks: 2, // 在被提取之前，一个依赖要出现多少次（也就是一个依赖会在遍历所有拆分的代码块时被重复发现多少次）
  // })
  // webpack-dashboard
  // new DashboardPlugin()
];

if (true) {
  plugins = plugins.concat([

    // 清理以前的版本/文件夹
    // 编译我们的最终资源
    new CleanPlugin('dist'),
    /* 生产环境的插件 */
    // loaders的调试模式
    // new webpack.LoaderOptionsPlugin({
    //   debug: true
    // }),
    // 这个插件可以防止webpack创建太小以至于不值得单独加载的块
    // new webpack.optimize.MinChunkSizePlugin({
    //   minChunkSize: 51200, // ~50kb
    // }),
    //这个插件会最小化所有最终资源的javascript代码
    new UglifyJSPlugin()
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     properties: false,
    //     warnings: false
    //   },
    //   output: {
    //     beautify: true,
    //     quote_keys: true
    //   },
    //   mangle: {
    //     screw_ie8: false
    //   },
    //   sourceMap: false
    // })
  ]);
}

module.exports = {
  devtool: production ? false : 'eval',
  entry: './src',
  output: {
    path: BUILDS_PATH,
    filename: 'bundle.js',
    // chunkFilename: '[name]-[chunkhash].js',
    // publicPath: 'static/'
  },
  plugins,
  module: {
    rules: [
      {
        test: /\.html/,
        loader: 'html-loader'
      },
      {
        test: /\.scss/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(png|gif|jpe?g|svg)$/i,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000
          }
        }]
      }
    ]
  }
};