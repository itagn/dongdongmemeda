/**
 *  Create by caidong on 2017/9
 */

const router = require('koa-router')()
const path = require('path')

const loginRouter = require('./login'),
      userRouter = require('./user'),
      blogRouter = require('./blog'),
      managerRouter = require('./manager')

module.exports = function(options){

  // 测试用的
  router.get('/', async  (ctx, next)=> {
    await ctx.render('index');
  });
  //  调用路由
  loginRouter(router, options)
  userRouter(router, options)
  blogRouter(router, options)
  managerRouter(router, options)
  return router
}

