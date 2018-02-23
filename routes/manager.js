/**
 *  Create by caidong on 2017/9
 */

const managerController = require('../controller/managerController')

module.exports = function (koaRouter, options) {
  // 创建Controller实例
  const manager= new managerController(options)
  // get请求

  // post请求
  koaRouter.post('/yaoqing/find', manager.findYaoqing)
  koaRouter.post('/yaoqing/create', manager.createYaoqing)
  koaRouter.post('/yaoqing/remove', manager.removeYaoqing)

  koaRouter.post('/manager/fengjin', manager.fengjinUser)
  koaRouter.post('/manager/jiefeng', manager.jiefengUser)
}
