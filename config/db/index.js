/**
 * mongodb配置属性
 */

const mongoose = require('mongoose')

module.exports = function (config) {
  mongoose.Promise = global.Promise // 全局的Promise
  mongoose.connect(config.env.mongodb)
  // 连接成功
  mongoose.connection.on('connected', function () {
    console.log('连接mongoose成功')
  })
  // 连接异常
  mongoose.connection.on('error', function (err) {
    console.log(`连接异常，错误为：${err}`)
  })
  // 连接断开
  mongoose.connection.on('disconnected', function () {
    console.log('连接mongoose断开')
  })

  return mongoose
}
