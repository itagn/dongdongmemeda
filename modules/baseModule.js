/**
 *  Create by caidong on 2017/9
 */

const _ = require('underscore')
const user = require('./userModule'),
      blog = require('./blogModule'),
      yaoqing = require('./yaoqingModule'),
      dynamic = require('./dynamicModule')

module.exports = class {
  constructor(mongoose) {
    // 集成全部module
    this.User = new (user)(mongoose, _)
    this.Blog = new (blog)(mongoose, _)
    this.Yaoqing = new (yaoqing)(mongoose, _)
    this.Dynamic = new (dynamic)(mongoose, _)
  }
}
