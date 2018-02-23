/**
 *  Create by caidong on 2017/9
 */

const _ = require('underscore')

module.exports = class{
  constructor(mongoose, _){
    this._ = _
    const Schame = mongoose.Schema
    const blogSchame = new Schame({

      createdBy: String, // 创建者ID

      author: String, // 作者名字

      createdOn: String, // 创建时间

      title: String, // 文章标题

      body: String, // 文章内容

      readNum: Number, // 文章阅读量

      secret: Boolean, // 文章私密

      field: String, // 文章区域

      level: { type: String, default: 'middle' },

      commentNum: { type: Number, default: 0 },

    })
    const Blog = mongoose.model('Blog', blogSchame)

    // 查找博客
    this.findBlogs = function (option) {
      return new Promise((resolve, reject) => {
        Blog.find(option, function (err, data) {
          if(err){
            reject({ status: 'failed', msg: '查询博客失败' })
          }else{
            resolve({ status: 'success', msg: '查询博客成功', data: data })
          }
        })
      })
    }

    // 创建博客
    this.createBlogs = function (moduleObj) {
      return new Promise((resolve, reject) => {
        const blogObj = new Blog(moduleObj)
        blogObj.save(moduleObj, function (err, data) {
          if(err){
            reject({ status: 'failed', msg: '创建博客失败' })
          }else{
            resolve({ status: 'success', msg: '创建博客成功', data: data })
          }
        })
      })
    }

    // 修改博客
    this.updateBlogs = function (g, s) {
      return new Promise((resolve, reject) => {
        Blog.update(g, { $set: s }, function (err ,data) {
          if(err){
            reject({status: 'failed', msg: '数据库更新失败', data: err})
          }else{
            resolve({status: 'success', msg: '数据库更新成功', data: data})
          }
        })
      })
    }

    // 删除博客
    this.removeBlogs = function (option) {
      return new Promise((resolve, reject) => {
        Blog.remove(option, function (err, data) {
          if(err){
            reject({status: 'failed', msg: '删除博客失败', data: err})
          }else{
            resolve({status: 'success', msg: '删除博客成功', data: true})
          }
        })
      })
    }

  }
}
