/**
 *  Create by caidong on 2017/9
 */

const baseController = require('./baseController')
const api = require('../routes/tools/api')
const fs = require('fs')
const images = require("images")
const info = require('../config/info')

module.exports = class extends baseController {
  constructor(options){
    super(options)

    // 项目初始化
    this.addAdmin = async(ctx, next) => {
       const isAdmin = await this.DBModule.User.findUser({ username: 'admin' })
       const date = new Date()
       const timer = date.getFullYear()+'-'+(date.getMonth()+1) +'-'+date.getDate()
       const salt = api.md5(Date.now().toString()) + '-' // 密码密钥
       if(isAdmin.data.length == 0){
         const username = info.admin.username
         const moduleObj = {
           username: username,
           password: api.md5(info.admin.password + salt),
           salt: salt,
           email: info.admin.email,
           createdOn: timer,
           userImgURL: `../../../static/user/${username}/faceU/user.jpg`,
           rooter: 'admin',
           fans: [],
           star: [],
         }
         const result = await this.DBModule.User.saveUser(moduleObj)
         if(result.status == 'success'){
           ctx.body = { status: 201, msg: '初始化完成,成功创建管理员'}
         }else{
           ctx.body = { status: 400, msg: '初始化失败'}
         }
       }else{
         ctx.body = { status: 200, msg: '初始化完成'}
       }
    }

    // 用户注册
    this.signUp = async(ctx, next) => {
      const params = ctx.request.body
      const isFind = await this.DBModule.User.findUser({ username: params.username })
      if(isFind.status == 'success' && isFind.data.length == 0){
        const isEmail = await this.DBModule.User.findUser({ email: params.email })
        if(isEmail.status == 'success' && isEmail.data.length == 0){
          const yaoqing = await this.DBModule.Yaoqing.findYaoqing({ yaoqing: params.yaoqing })
          if(yaoqing.status == 'success' && yaoqing.data.length > 0) {
            let isAllow = []
            info.userBlack.regexp.forEach(function (val, index) {
              const patt = new RegExp(val)
              if(patt.test(params.username)){
                 isAllow.push('no')
              }else{
                isAllow.push('yes')
              }
            })
            if(!info.userBlack.all.includes(params.username) && !isAllow.includes('no')){
              const yaoqingma = await this.DBModule.Yaoqing.findYaoqing({ yaoqing: params.yaoqing })
              if(yaoqingma.data[0].useNum == 1){
                await this.DBModule.Yaoqing.removeYaoqing({ yaoqing: params.yaoqing })
              }else{
                await this.DBModule.Yaoqing.updateYaoqing({ yaoqing: params.yaoqing }, { useNum: yaoqingma.data[0].useNum - 1 })
              }
              const date = new Date()
              const timer = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()
              const salt = api.md5(Date.now().toString()) + '-' // 密码密钥
              const userObj = {
                username: params.username,
                password: api.md5(params.password + salt),
                salt: salt,
                email: params.email,
                createdOn: timer,
                userImgURL: `../../../static/user/${params.username}/faceU/user.jpg`,
                fans: [],
                star: [],
              }
              const result = await this.DBModule.User.saveUser(userObj)
              if(result.status == 'success'){
                const oldJpgPath = './src/assets/user.jpg'
                const oldPngPath = './src/assets/user.png'
                const dir = `./static/user/${params.username}/`
                fs.mkdirSync(dir)
                const faceU = `${dir}faceU/`
                fs.mkdirSync(faceU)
                const file = `${dir}file/`
                fs.mkdirSync(file)
                const newJpgPath = `${faceU}user.jpg`
                const newPngPath = `${faceU}user.png`
                await api.copyFile(oldJpgPath, newJpgPath)
                await api.copyFile(oldPngPath, newPngPath)
                ctx.body = { status: 200, msg: result.msg, data: result.data}
              }else{
                ctx.body = { status: 403, msg: result.msg }
              }
            }else{
              ctx.body = { status: 707, msg: '注册名含有敏感词汇' }
            }
          }else{
            ctx.body = { status: 402, msg: '邀请码不正确' }
          }
        }else{
          ctx.body = { status: 401, msg: '邮箱已经被使用' }
        }
      }else{
        ctx.body = { status: 400, msg: '用户名被注册' }
      }
    }

    // 用户登录
    this.signIn = async(ctx, next) => {
      const params = ctx.request.body
      const isFind = await this.DBModule.User.findUser({ username: params.username })
      if(isFind.status == 'success'){
        if(isFind.data.length > 0){
          if(isFind.data[0].password == api.md5(params.password + isFind.data[0].salt)){
            const user = await this.DBModule.User.findUser({ username: params.username })
            let {
              username = '-',
              email = '-',
              createdOn = '-',
              userImgURL = '-',
              rooter = '-',
              blackMD = '-',
              blackTime = '-',
              fans = '-',
              star = '-'
            } = user.data[0];
            const userInfo = { username,email,createdOn,userImgURL,rooter,blackMD,blackTime,fans,star };
            userInfo.userId = user.data[0]._id;
            ctx.body = { status: 200, msg: '验证成功', data: userInfo }
          }else{
            ctx.body = { status: 402, msg: '密码错误' }
          }
        }else{
          ctx.body = { status: 401, msg: '用户名不存在' }
        }
      }else{
        ctx.body = { status: 400, msg: '服务器访问数据失败' }
      }
    }

    // 发送验证码到邮箱
    this.sendEmail = async(ctx, next) => {
      const params = ctx.request.body
      const isFind = await this.DBModule.User.findUser({ username: params.username })
      if(isFind.status == 'success' && isFind.data.length > 0){
        const auth = Math.random().toString(16).slice(2, 8)
        const expires = 60*3  // 验证码三分钟有效期
        const isSucc = await api.setRedis(isFind.data[0].email, auth, expires)
        if(isSucc){
          const isSend = api.sendEmail(isFind.data[0].email, auth, expires/60);
          if(isSend){
            ctx.body = { status: 200, msg: '邮件发送成功，请注意查收' }
          }else{
            ctx.body = { status: 402, msg: '邮件发送失败，请重发' }
          }
        }else{
          ctx.body = { status: 401, msg: '验证码保存失败，请重新提交' }
        }
      }else{
        ctx.body = { status: 400, msg: '用户名不存在，请重输' }
      }

    }

    // 比对验证码
    this.sendAuth = async(ctx, next) => {
      const params = ctx.request.body
      const user = await this.DBModule.User.findUser({ username: params.username })
      const auth = await api.getRedis(user.data[0].email)
      if(auth == params.auth){
        ctx.body = { status: 200, msg: '验证成功' }
      }else{
        ctx.body = { status: 400, msg: '验证码错误' }
      }
    }

    // 重置密码
    this.sendPassword = async(ctx, next) => {
      const params = ctx.request.body
      const salt = api.md5(Date.now().toString()) + '-' // 密码密钥
      const result = await this.DBModule.User.updateUser({ username: params.username}, { password: api.md5(params.password + salt), salt: salt})
      if(result.status == 'success'){
        ctx.body = { status: 200, msg: '修改密码成功' }
      }else{
        ctx.body = { status: 400, msg: '修改密码失败' }
      }
    }

    // 用户更换头像
    this.faceU = async(ctx, next) => {
      const params = ctx.request.req.body
      const fileName = ctx.request.req.file.filename
      const fileArr = fileName.split('.')
      const fileType = fileArr[fileArr.length-1]
      const username = params.username

      const opt = { username: username }
      const reFileInfo = await this.DBModule.User.findUser(opt)
      const brr = reFileInfo.data[0].userImgURL.split('/')
      const reFile = brr[brr.length-1].split('.')[0]

      if(reFile != 'user'){
        const oldFileName = `static/user/${username}/faceU/${reFile}.jpg`
        await api.removeFile(oldFileName)
      }

      const oldPath = `src/user/faceU/${fileName}`
      const newPath = `static/user/${username}/faceU/${fileName}`
      const result = await api.moveFile(oldPath, newPath)

      const jpgPath = `static/user/${username}/faceU/user.jpg`
      const pngPath = `static/user/${username}/faceU/user.png`
      const jpgResPath = `static/user/${username}/faceU/${fileArr[0]}.jpg`

      if(result.status == 'success'){
        if(fileType == 'png'){
          images(newPath).size(640).draw(images(jpgPath), 640, 0).save(jpgResPath)
          const reFileName = `static/user/${username}/faceU/${fileName}`
          await api.removeFile(reFileName)
        }else if(fileType == 'jpg'){
          images(newPath).size(640).draw(images(pngPath), 640, 0).save(jpgResPath)
        }
        const userImgURL = `../../../static/user/${params.username}/faceU/${fileArr[0]}.jpg`
        const g = { username: params.username }
        const s = { userImgURL: userImgURL }
        await this.DBModule.User.updateUser(g, s)
        ctx.body = { status: 200, msg: '更换头像成功', data: userImgURL }
      }else{
        ctx.body = { status: 400, msg: '更换头像失败，请重试' }
      }
    }

    // 获取用户当前数据
    this.getUser = async(ctx, next) => {
      const params = ctx.request.body
      const user = await this.DBModule.User.findUser({ _id: params.userId })
      if(user.status == 'success'){
        if(user.data.length > 0){
          let {
            username = '-',
            email = '-',
            userImgURL = '-',
            createdOn = '-',
            rooter = '-',
            blackMD = '-',
            blackTime = '-',
            fans = '-',
            star = '-'
          } = user.data[0];
          const userInfo = { username,email,userImgURL,createdOn,rooter,blackMD,blackTime,fans,star }
          userInfo.userId = user.data[0]._id;
          ctx.body = { status: 200, msg: '查询用户数据成功', data: userInfo }
        }else{
          ctx.body = { status: 401, msg: '请用户登录，游客没有这个权限' }
        }
      }else{
        ctx.body = { status: 400, msg: '查询用户数据失败' }
      }
    }

    // 添加粉丝
    this.addFans = async(ctx, next) => {
      const params = ctx.request.body
      const starUser = await this.DBModule.User.findUser({ _id: params.starId })
      const fansUser = await this.DBModule.User.findUser({ _id: params.fansId })
      let arr = starUser.data[0].fans
      arr.push({ username: params.fansName, userId: params.fansId })
      const starFans = arr
      let brr = fansUser.data[0].star
      brr.push({ username: params.starName, userId: params.starId })
      const fansStar = brr

      const str = await this.DBModule.User.updateUser({ _id: params.starId }, { fans: starFans })
      const fan =  await this.DBModule.User.updateUser({ _id: params.fansId }, { star: fansStar })
      if(str.status=='success'&&fan.status=='success'){
        ctx.body = { status: 200, msg: '关注成功' }
      }else{
        ctx.body = { status: 400, msg: '关注失败' }
      }
    }

    // 删除粉丝
    this.subFans = async(ctx, next) => {
      const params = ctx.request.body
      const starUser = await this.DBModule.User.findUser({ _id: params.starId })
      const fansUser = await this.DBModule.User.findUser({ _id: params.fansId })
      let arr = []
      starUser.data[0].fans.forEach(function (val, index) {
        if(val.userId != params.fansId){
          arr.push(val)
        }
      })
      const starFans = arr
      let brr = []
      fansUser.data[0].star.forEach(function (val, index) {
        if(val.userId != params.fansId){
          brr.push(val)
        }
      })
      const fansStar = brr

      const str = await this.DBModule.User.updateUser({ _id: params.starId }, { fans: starFans })
      const fan =  await this.DBModule.User.updateUser({ _id: params.fansId }, { star: fansStar })
      if(str.status=='success'&&fan.status=='success'){
        ctx.body = { status: 200, msg: '取消关注成功' }
      }else{
        ctx.body = { status: 400, msg: '取消关注失败' }
      }
    }


  }
}
