const Koa = require('koa')
const cors = require('kcors')
const app = new Koa()
const path =require('path')
// import session from 'koa2-cookie-session'
// const session = require('koa2-cookie-session')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const koaNunjucks = require('koa-nunjucks-2');
const logger = require('koa-logger')
const config = require('./config')[process.env.NODE_ENV || 'dev']
const mongodb = require('./config/db')(config)
const DBModule = new (require('./modules/baseModule'))(mongodb)
const router = require('./routes/baseRouter')({config: config, DBModule: DBModule})
const info = require('./config/info')

//  服务端口，默认为 3000
process.env.PORT = info.serverAddress.port;

// error handler
onerror(app)

// 请求体设置
app.use(bodyparser({
  enableTypes:['json', 'form', 'text'],  //请求类型
  jsonLimit: '5mb', // 控制parse转换大小，默认1mb
  formLimit: '4096kb', // 控制post带下，默认56kb
}))
app.use(cors())  //  允许跨域
app.use(json())
app.use(logger())

// app.use(session({
//   key: 'caidong-session',   // 默认 'koa:sid'
//   expires: 1/24, // 一天除以24小时除以60分钟得到秒
//   path: '/', // 允许所有路径访问cookie
// }))

app.use(require('koa-static')(`${__dirname}/static`))

// 载入模板引擎
app.use(koaNunjucks({
  ext: 'html',
  path: path.join(__dirname, '/static'),
  nunjucksConfig: {
    autoescape: true,
    watch: true
  }
}));

// 启动的日志
app.use( async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// 路由入口
app.use(router.routes(), router.allowedMethods())

module.exports = app
