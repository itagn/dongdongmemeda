/**
 *  Create by caidong on 2017/9
 */

const _ = require('underscore')

module.exports = class{
  constructor(mongoose, _){
    this._ = _
    const Schema = mongoose.Schema
    const yaoqingSchema = new Schema({

      yaoqing: String, // 用户注册必备

      createdOn: String, // 注册的时间

      createdBy: String, // 注册人ID

      useNum: { type: Number, default: 3 } // 一个注册码允许注册的最大量

    })
    const Yaoqing = mongoose.model('Yaoqing', yaoqingSchema)

    // 生成邀请码
    this.createYaoqing = function (moduleObj) {
      return new Promise((resolve, reject) => {
        const yaoqingObj = new Yaoqing(moduleObj)
        yaoqingObj.save(moduleObj, function (err, data) {
          if(err){
            reject({status: 'failed', msg: '生成邀请码失败，请重试', data: err})
          }else{
            resolve({status: 'success', msg: '生成邀请码成功', data: data})
          }
        })
      })
    }

    // 查找邀请码
    this.findYaoqing = function (option) {
      return new Promise((resolve, reject) => {
        Yaoqing.find(option, function (err, data) {
          if(err){
            reject({status: 'failed', msg: '查询邀请码失败', data: err})
          }else{
            resolve({status: 'success', msg: '查询邀请码成功', data: data})
          }
        })
      })
    }

    // 修改邀请码
    this.updateYaoqing = function (g, s) {
      return new Promise((resolve, reject) => {
        Yaoqing.update(g, { $set: s }, function (err, data) {
          if(err){
            reject({status: 'failed', msg: '修改邀请码失败', data: err})
          }else{
            resolve({status: 'success', msg: '修改邀请码成功', data: data})
          }
        })
      })
    }

    // 删除邀请码
    this.removeYaoqing = function (option) {
      return new Promise((resolve, reject) => {
        Yaoqing.remove(option, function (err, data) {
          if(err){
            reject({status: 'failed', msg: '删除邀请码失败', data: err})
          }else{
            resolve({status: 'success', msg: '删除邀请码成功', data: true})
          }
        })
      })
    }

  }
}
