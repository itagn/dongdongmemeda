/**
 *  Create by caidong on 2017/9
 */

const blogController = require('../controller/blogController')

module.exports = function (koaRouter, options) {
  // 创建Controller实例
  const blog = new blogController(options)
  // get请求

  // post请求
  koaRouter.post('/blog/findAll', blog.findBlogs)
  koaRouter.post('/blog/create', blog.createBlogs)
  koaRouter.post('/blog/getInfo', blog.getBlogs)
  koaRouter.post('/blog/search', blog.searchBlogs)
  koaRouter.post('/blog/remove', blog.removeBlogs)
  koaRouter.post('/blog/qrcode', blog.qrcode)
  koaRouter.post('/comment/create', blog.createComment)
  koaRouter.post('/comment/remove', blog.removeComment)
  koaRouter.post('/comment/up', blog.upComment)
  koaRouter.post('/comment/down', blog.downComment)
  koaRouter.post('/dynamic/create', blog.createDynamic)
}
