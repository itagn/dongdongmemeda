/**
 *  Create by caidong on 2017/9
 */

const userController = require('../controller/userController')

module.exports = function (koaRouter, options) {
  // 创建Controller实例
  const user = new userController(options)
  // get请求

  // post请求
  koaRouter.post('/addAdmin',user.addAdmin)  // 初始化
  koaRouter.post('/signUp', user.signUp) // 用户注册
  koaRouter.post('/signIn', user.signIn) // 用户登录
  koaRouter.post('/forget/sendEmail', user.sendEmail) // 发送验证码到邮箱
  koaRouter.post('/forget/sendAuth', user.sendAuth) // 比对验证码
  koaRouter.post('/forget/sendPassword', user.sendPassword) // 重置密码
}
