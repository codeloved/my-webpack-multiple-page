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

// 动态添加入口
function getEntry() {
  var entry = {}
  // 返回的格式为./src/js/index.js  ./src/js/test/test.js数组
  glob.sync('./src/js/**/*.js').forEach(function(name) {
    var start = name.indexOf('src/') + 4
    var many = name.length - 3
    var eArr = []
    var n = name.slice(start, many) // js/index js/test/test
    // 此key为js/后的名称,因为key不能重复,所以js下的一级目录和js直属文件不能相同,如上,分别取得index和第一个test,两个名称不能相同
    var key = n.split('/')[1]
    // bable垫片,babel只能转义箭头函数,class等,不能转换Map，Set，Promise等新的全局对象,需要将垫片代码加入文件的头部去兼容某些不支持此语法的
    // 浏览器,因为是多文件,所以每个头部都要加入此代码,并且,一定要在数组的最前面, 注意命名变量时不要使用这些全局对象,作用域会覆盖全局对象
    eArr.push('babel-polyfill')
    eArr.push(name)
    entry[key] = eArr
  })

  return eArr
}

getEntry()