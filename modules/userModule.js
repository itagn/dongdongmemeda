/**
 *  Create by caidong on 2017/9
 */

const _ = require('underscore')

module.exports = class{
  constructor(mongoose, _){
    this._ = _
    const Schema = mongoose.Schema
    const userSchema = new Schema({

      username: String, //  用户名

      password: String, // 密码

      salt: String, // 密码密钥

      email: String, // 邮箱用于找回密码

      createdOn: String, // 创建时间

      userImgURL: String, // 头像图片路劲

      rooter: { // 权限，管理员为admin，普通成员为other
        type: String,
        default: 'other',
      },

      blackMD: { type: Boolean, default: false },  // 黑名单

      blackTime: { type: Number, default: 0 },  //  黑名单时间

      fans: [{   //  用户粉丝
        username: String,
        userId: String,
      }],

      star:[{  // 用户关注
        username: String,
        userId: String,
      }],

    })
    const User = mongoose.model('User', userSchema)

    // 注册
    this.saveUser = function (moduleObj) {
      return new Promise((resolve, reject) => {
        const userObj = new User(moduleObj)
        userObj.save(function (err, data) {
          if(err){
            reject({status: 'failed', msg: '注册失败，请重试', data: err})
          }else{
            resolve({status: 'success', msg: '注册成功，现在去登录吧', data: data})
          }
        })
      })
    }

    // 查询用户
    this.findUser = function (option) {
      return new Promise((resolve, reject) => {
        User.find(option, function (err, data) {
          if(err){
            reject({status: 'failed', msg: '查询失败', data: err})
          }else{
            resolve({status: 'success', msg: '查询成功', data: data})
          }
        })
      })
    }

    // 修改用户信息
    this.updateUser = function (g, s) {
      return new Promise((resolve, reject) => {
        User.update(g, { $set: s }, function (err, data) {
          if(err){
            reject({status: 'failed', msg: '数据库更新失败', data: err})
          }else{
            resolve({status: 'success', msg: '数据库更新成功', data: data})
          }
        })
      })
    }



  }
}
