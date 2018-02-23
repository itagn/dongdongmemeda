/**
 *  Create by caidong on 2017/9
 */

const _ = require('underscore')

module.exports = class {
  constructor(mongoose, _){
    this._ = _
    const Schema = mongoose.Schema
    const DynamicSchema = new Schema({

      createdOn: String,

      createdBy: String,

      userImgURL: String,

      author: String,

      body: String,

      blogId: String,

      up: Number,

      down: Number,

      reply: [{

          body: String,

          author: String,

          createdOn: String,

          userImgURL: String,

          createdBy: String,

          parentId: String,

          prevMsg: String,

          createdTo: String,

        }],

    })
    const Dynamic = mongoose.model('Dynamic', DynamicSchema)

    // 查找博文评论
    this.findDynamic = function (option) {
      return new Promise((resolve, reject) => {
        Dynamic.find(option, function (err, data) {
          if(err){
            reject({ status: 'failed', msg: '查询回复失败' })
          }else{
            resolve({ status: 'success', msg: '查询回复成功', data: data })
          }
        })
      })
    }

    // 创建博文评论
    this.createDynamic = function (moduleObj) {
      return new Promise((resolve, reject) => {
        const dynamicObj = new Dynamic(moduleObj)
        dynamicObj.save(moduleObj, function (err, data) {
          if(err){
            reject({ status: 'failed', msg: '创建回复失败' })
          }else{
            resolve({ status: 'success', msg: '创建回复成功', data: data })
          }
        })
      })
    }

    // 修改博文评论
    this.updateDynamic = function (g, s) {
      return new Promise((resolve, reject) => {
        Dynamic.update(g, { $set: s }, function (err ,data) {
          if(err){
            reject({status: 'failed', msg: '数据库更新失败', data: err})
          }else{
            resolve({status: 'success', msg: '数据库更新成功', data: data})
          }
        })
      })
    }

    // 删除博文评论
    this.removeDynamic = function (option) {
      return new Promise((resolve, reject) => {
        Dynamic.remove(option, function (err, data) {
          if(err){
            reject({status: 'failed', msg: '删除回复失败', data: err})
          }else{
            resolve({status: 'success', msg: '删除回复成功', data: true})
          }
        })
      })
    }
  }
}
