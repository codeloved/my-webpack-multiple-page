var webpack = require('webpack')
var path = require('path') // node模块
var glob = require('glob') // 获取对应规则文件
var HtmlWebpackPlugin = require('html-webpack-plugin') // 通过html模板生成HTML页面
var MiniCssExtractPlugin = require('mini-css-extract-plugin') // 分离css
var CopyWebpackPlugin = require('copy-webpack-plugin') // 复制文件到指定文件夹
var os = require('os') // node模块
var portfinder = require('portfinder') // 发现可用端口
var fs = require('fs') // node模块
var { CleanWebpackPlugin } = require('clean-webpack-plugin') // 清除webpack打包目录
var ManifestPlugin = require('webpack-manifest-plugin')

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
              ident: 'postcss',
              plugins: (loader) => [
                require('postcss-import')({ root: loader.resourcePath }), // 解决@import引入路径问题,可以找到node_modules下的样式文件
                require('postcss-cssnext')(), // 给样式的值加兼容性前缀 display:-ms-flexbox;
                require('autoprefixer')(), // 给样式的key加兼容性前缀 -webkit-transform
                require('cssnano')() // 压缩css
              ]
            }
          },
          'less-loader'
        ]
      },
      {
        test:/\.(png|jpg|gif|jpeg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192, // 小于8192b的图片,会直接打包到js文件,超过使用file-loader处理,并且所有的参数都会传递给file-loader,所以file-loader的参数也在此处配置
              name: '[name]-[hash].[ext]',  // file-loader配置
              // outputPath: '/assets/images',
              outputPath: (url, resourcePath, context) => {
                // D:\tgit\my-webpack-multiple-page\src\assets\images\icon.jpg(resourcePath) window系统下
                var resourcePathSrt = resourcePath.replace(/\\/g, '/')
                var start = resourcePathSrt.indexOf('src/') + 4
                var end = resourcePathSrt.lastIndexOf('/') + 1
                var path = resourcePathSrt.substring(start, end)
                return path + url
              }
            }
          }
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
    new CleanWebpackPlugin(),
    new webpack.ProvidePlugin({ // 此方法会自动加载模块,不需要再源码中import和require,且是全局模块,全局都可以使用,并且不使用的模块,jquery就不会打包进来
      $: 'jquery'
    }),
    new CopyWebpackPlugin([
      {
        from: 'src/public',  // Copy directory contents to {output}/to/directory/ { from: 'from/directory', to: 'to/directory' }
        to: 'public'
      }
    ]),
    new ManifestPlugin()
  ],
  devServer: { // dist下不会有相应文件夹,在内存里,但是可以访问到
    contentBase: path.join(__dirname, 'dist'),
    host: '0.0.0.0', // localhost:9000, 127.0.0.1:9000, ip:9000均可访问
    historyApiFallback: false,
    hot: true,
    inline: true,
    compress: true,
    port: 9000,
    open: true,
    overlay: true,
  }
}