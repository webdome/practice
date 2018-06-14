const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CleanWebpackPlugin = require('clean-webpack-plugin')
const devMode = process.env.NODE_ENV !== 'production'


const htmlPlugin = new HtmlWebPackPlugin({
  template: path.join(__dirname, './src/index.html'),
  filename: 'index.html'
})
const cssPlugin = new MiniCssExtractPlugin({
  filename: devMode ? '[name].css' : '[name].[hash].css',
  chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
})


module.exports = {
  mode: devMode ? 'development' : 'production',
  entry: './src/index.jsx',
  plugins: [
    htmlPlugin,
    cssPlugin,
    new CleanWebpackPlugin(['dist'])
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader?modules',
          // 'css-loader?modules&localIdentName=[path][name]-[local]-[hash:32]',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.js|jsx$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000,
            outputPath: 'images'
          }
        }]
      }
    ]
  },
  resolve: {
    // 扩展名
    extensions: ['.js', '.jsx'],
    // 别名
    alias: {
      '@': path.join(__dirname, './src'),
      '@components': path.join(__dirname, './src/components')
    }
  }
}