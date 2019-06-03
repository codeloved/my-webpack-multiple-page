var webpack = require('webpack')
var path = require('path') // node模块
var glob = require('glob') // 获取对应规则文件
var HtmlWebpackPlugin = require('html-webpack-plugin') // 通过html模板生成HTML页面
var MiniCssExtractPlugin = require('mini-css-extract-plugin') // 分离css
var TransferWebpackPlugin = require('transfer-webpack-plugin') // 复制文件到指定文件夹
var autoprefixer = require('autoprefixer') // 给浏览器加css兼容性前缀
var os = require('os') // node模块
var portfinder = require('portfinder') // 发现可用端口
var fs = require('fs') // node模块
var { CleanWebpackPlugin } = require('clean-webpack-plugin') // 清除webpack打包目录

// 动态添加入口
function getEntry() {
  var entry = {}
  // 返回的格式为./src/js/index.js  ./src/js/test/test.js数组
  glob.sync('./src/js/**/*.js').forEach(function(name) {
    var start = name.indexOf('src/') + 4
    var many = name.length - 3
    var eArr = []
    var key = name.slice(start, many) // js/index js/test/test
    // 此key为js/后的名称,因为key不能重复,所以js下的一级目录和js直属文件不能相同,如上,分别取得index和第一个test,两个名称不能相同
    // var key = n.split('/')[1]
    eArr.push(name)
    entry[key] = eArr
  })

  return entry
}

function getHtmlConfig() {

}

module.exports = {
  entry: getEntry(),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        include: /src/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.less$/,
        exclude: /(node_modules)/,
        include: /src/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
              reloadAll: true,
            }
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('autoprefixer')
              ]
            }
          },
          'less-loader'
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      moduleFilename: function({ name }) {
        return `${name.replace('js/', 'css/')}.css`
      },
      chunkFilename: '[id].css',
    }),
    new CleanWebpackPlugin()
  ]
}