/**
 *  Create by caidong on 2017/9
 */

const baseController = require('./baseController')

module.exports = class extends baseController{
  constructor(options){
    super(options)

    // 管理员生成邀请码
    this.createYaoqing = async(ctx, next) => {
      const params = ctx.request.body
      const admin = await this.DBModule.User.findUser({ _id: params.createdBy })
      if(admin.status == 'success' && admin.data[0].rooter == 'admin'){
        let {
          yaoqing = '-',
          createdOn = '-',
          createdBy = '-',
        } = params;
        const moduleObj = { yaoqing, createdOn, createdBy }
        const yaoqingData = await this.DBModule.Yaoqing.findYaoqing({})
        if(!yaoqingData.data.includes(params.yaoqing)){
          const result = await this.DBModule.Yaoqing.createYaoqing(moduleObj)
          if(result.status == 'success'){
            const yaoqing = await this.DBModule.Yaoqing.findYaoqing({})
            ctx.body = { status: 200, msg: result.msg, data: yaoqing.data }
          }else{
            ctx.body = { status: 402, msg: result.msg }
          }
        }else{
          ctx.body = { status: 401, msg: '邀请码已存在' }
        }
      }else{
        ctx.body = { status: 400, msg: '您不是管理员' }
      }

    }

    // 管理员查看邀请码
    this.findYaoqing = async(ctx, next) => {
      const params = ctx.request.body
      const admin = await this.DBModule.User.findUser({ _id: params.userId })
      if(admin.status == 'success' && admin.data[0].rooter == 'admin'){
        const yaoqing = await this.DBModule.Yaoqing.findYaoqing({})
        if(yaoqing.status == 'success'){
          const user = await this.DBModule.User.findUser({ rooter: 'other' })
          if(user.status == 'success'){
            const whiteUser = await this.DBModule.User.findUser({ blackMD: false, rooter: 'other' })
            const blackUser = await this.DBModule.User.findUser({ blackMD: true, rooter: 'other' })
            const data = {
              yaoqings: yaoqing.data,
              users: user.data,
              white: whiteUser.data,
              black: blackUser.data,
            }
            ctx.body = { status: 200, msg: '查询邀请码成功', data: data }
          }else{
            ctx.body = { status: 402, msg: '查询用户数据出错', data: user.data }
          }
        }else{
          ctx.body = { status: 401, msg: '查询邀请码出错', data: yaoqing.data }
        }
      }else{
        ctx.body = { status: 400, msg: '您不是管理员' }
      }
    }

    // 管理员删除邀请码
    this.removeYaoqing = async(ctx, next) => {
      const params = ctx.request.body
      const admin = await this.DBModule.User.findUser({ _id: params.userId })
      if(admin.status == 'success' && admin.data[0].rooter == 'admin'){
        const result = await this.DBModule.Yaoqing.removeYaoqing({ yaoqing: params.yaoqing })
        if(result.status == 'success'){
          const yaoqing = await this.DBModule.Yaoqing.findYaoqing({})
          ctx.body = { status: 200, msg: '删除邀请码成功', data: yaoqing.data }
        }else{
          ctx.body = { status: 401, msg: '删除邀请码失败' }
        }
      }
      else{
        ctx.body = { status: 400, msg: '您不是管理员' }
      }
    }

    // 管理员封号账户
    this.fengjinUser = async(ctx, next) => {
      const params = ctx.request.body
      const admin = await this.DBModule.User.findUser({ _id: params.userId })
      if(admin.status == 'success'){
        if(admin.data.length > 0 && admin.data[0].rooter == 'admin'){
          const result = await this.DBModule.User.updateUser({ username: params.fengjin }, { blackMD: true, blackTime: 3600*12*30 })
          if(result.status == 'success'){
            ctx.body = { status: 200, msg: `封禁用户 ${params.fengjin} 成功` }
          }else{
            ctx.body = { status: 402, msg: `封禁用户 ${params.fengjin} 失败` }
          }
        }
        else{
          ctx.body = { status: 401, msg: '您不是管理员，不能管理员用户' }
        }
      }else{
        ctx.body = { status: 400, msg: '查询数据出错' }
      }
    }

    // 管理员解封账户
    this.jiefengUser = async(ctx, next) => {
      const params = ctx.request.body
      const admin = await this.DBModule.User.findUser({ _id: params.userId })
      if(admin.status == 'success'){
        if(admin.data.length > 0 && admin.data[0].rooter == 'admin'){
          const result = await this.DBModule.User.updateUser({ username: params.jiefeng }, { blackMD: false, blackTime: 0 })
          if(result.status == 'success'){
            ctx.body = { status: 200, msg: `解封用户 ${params.jiefeng} 成功` }
          }else{
            ctx.body = { status: 402, msg: `解封用户 ${params.jiefeng} 失败` }
          }
        }
        else{
          ctx.body = { status: 401, msg: '您不是管理员，不能管理员用户' }
        }
      }else{
        ctx.body = { status: 400, msg: '查询数据出错' }
      }
    }


  }
}
