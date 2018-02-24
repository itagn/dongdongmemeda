/**
 *  Create by caidong on 2017/9
 */

const info = require('../../config/info')
const redis = require('redis')
const nodeMailer = require('nodemailer')
const fs = require('fs')
const crypto = require('crypto')
const qrcode = require('qrcode')

const api = {

  // 获取redis
  async getRedis(auth){
    // 配置基础信息
    const config = {
        host: info.redis.host,
        port: info.redis.port, // 已经修改端口，默认6379
        db: info.redis.db
      }
    // 创建redis连接
    const client = redis.createClient(config)
    return new Promise((resolve, reject) => {
      // 从redis获取数据
      client.get(auth, function (err, reply) {
        if(err){
          reject(err)
        }else{
          resolve(JSON.parse(reply))
        }
      })
    })
  },

  // 设置redis
  async setRedis(auth, str, expires){
    // 配置基础信息
    const config = {
      host: info.redis.host,
      port: info.redis.port, // 已经修改端口，默认6379
      db: info.redis.db
    }
    // 创建redis连接
    const client = redis.createClient(config);
    return new Promise((resolve, reject) => {
      // 保存数据到redis
      client.set(auth, JSON.stringify(str), 'EX', expires, function (err) {
        if(err){
          reject(false)
        }else{
          resolve(true)
        }
      })
    })
  },

  // 发送邮件
  sendEmail(email ,auth ,expires){
    // 发件人信息
    const config = {
      "host": info.email.host, //邮件类型
      "port": info.email.port, // 端口
      "auth": {
        "user": info.email.user, // 发件人账户
        "pass": info.email.pass // 发件人密码
      }
    }
    const smtpTransport = nodeMailer.createTransport(config);
    const sendTime = (new Date()).getFullYear()+'-'+((new Date()).getMonth()+1)+'-'+(new Date()).getDate()
    const mailOption = {
      from: info.email.user, // 发件人账户
      to: email, // 收件人账户
      subject: '找回密码服务', // 邮件主题
      html: `<pre>谁家的大佬：
    您好
    您的验证码为：<b style="color: green;">${auth}</b>。请不要告诉别人!验证码有效时间<b style="color: green;">${expires}分钟</b>。
祝好
                                                东东么么哒
                                                ${sendTime}</pre>`
    }
    // 发送邮件
    smtpTransport.sendMail(mailOption, function (error, response) {
      if(error){
        return false
      }
      smtpTransport.close()
    })
    return true
  },

  // 复制文件
  copyFile(oldPath, newPath){
    return new Promise((resolve, reject) => {
      try{
        const fileReadStream = fs.createReadStream(oldPath)
        const fileWriteStream = fs.createWriteStream(newPath)
        fileReadStream.pipe(fileWriteStream)
        fileWriteStream.on('close', function () {
          console.log('文件复制完成')
          resolve({ status: 'success', msg: '文件复制完成' })
        })
      }catch(err) {
        console.log(err)
        reject({ status: 'failed', msg: '文件复制失败' })
      }
    })
  },

  // 删除文件
  removeFile(path){
    return new Promise((resolve, reject) => {
      try {
        fs.unlink(path, (err) => {
          if (err) {
            resolve({status: false})
            return false
          } else {
            resolve({status: true})
          }
        });
      }
      catch (err) {
        console.log('文件删除失败')
        reject({status: false})
      }
    })
  },

  // 文件移动
  moveFile(oldPath, newPath){
    return new Promise((resolve, reject) => {
      fs.rename(oldPath, newPath, err => {
        if (err) {
          console.log(err);
          reject({status: 'failed', msg:'文件移动失败'})
          return
        } else {
          resolve({status: 'success', msg: '文件移动成功'})
        }
      });
    })
  },

  //MD5加密解密方法
  md5(str, encoding){
    return crypto
      .createHash('md5')
      .update(str)
      .digest(encoding || 'hex')
  },

  // 二维码
  mkQrcode(data){
    return new Promise((resolve, reject) => {
      qrcode.toDataURL(data, function (err, url) {
        if(err){
          console.log(err)
          reject({status: 'failed', msg:'二维码生成失败'})
        }else{
          resolve({status: 'success', msg: '二维码生成成功', data: url})
        }
      })
    })
  },

}
module.exports = api
