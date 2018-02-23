/**
 *  Create by caidong on 2017/9
 */

const baseController = require('./baseController')
const api = require('../routes/tools/api')

module.exports = class extends baseController {
  constructor(options){
    super(options)

    // 查询所有评论
    this.findBlogs = async(ctx, next) => {
      const params = ctx.request.body
      const isFind = await this.DBModule.Blog.findBlogs({ secret: false })
      if(isFind.status === 'success'){
        const blogs = [];
        for(let val of isFind.data){
          const data = JSON.parse(JSON.stringify(val))
          blogs.unshift(data);
        }
        let resBlog = [], len = 9, startNum, endNum;
        startNum = blogs.length > len ? len*(params.page-1) : 0;
        endNum = blogs.length > len ? (blogs.length < len*params.page ? blogs.length : len*(params.page)) : blogs.length;
        for(let i= startNum; i< endNum; i++){
          let {
            _id = '-',
            createdBy = '-',
            author = '-',
            createdOn = '-',
            readNum = '-',
            secret = '-',
            field = '-',
            level = '-',
            commentNum = '-'
          } = blogs[i];
          const blogObj = { _id,createdBy,author,createdOn,readNum,secret,field,level,commentNum };
          blogObj.title = blogs[i].title.replace(/&lt;/g,'<').replace(/&gt;/g,'>');
          blogObj.body = blogs[i].body.replace(/&lt;/g,'<').replace(/&gt;/g,'>');
          resBlog.push(blogObj);
        }
        const total = Math.ceil(blogs.length/len) * len
        if(params.username != '游客'){
          const result = await this.DBModule.User.findUser({ username: params.username })
          const userImgURL = result.data[0].userImgURL
          const myBlogs = await this.DBModule.Blog.findBlogs({ createdBy: params.userId })
          const myBlogNum = myBlogs.data.length
          const reqData = {
            resBlog: resBlog,
            rooter: 'admin',
            userImgURL: userImgURL,
            total: total,
            myBlogNum: myBlogNum,
            fans: result.data[0].fans,
            star: result.data[0].star,
          }
          if(result.status == 'success' && result.data[0].rooter == 'admin'){
            reqData.rooter = 'admin'
            ctx.body = { status: 200, msg: '博客查询成功', data: reqData }
          }else{
            reqData.rooter = 'other'
            ctx.body = { status: 200, msg: '博客查询成功', data: reqData }
          }
        }else{
          const reqData = {
            resBlog: resBlog,
            rooter: 'other',
            userImgURL: '',
            total: total,
          }
          ctx.body = { status: 200, msg: '博客查询成功', data: reqData }
        }
      }else{
        ctx.body = { status: 400, msg: '博客查询失败' }
      }
    }

    // 新建博客
    this.createBlogs = async(ctx, next) => {
      const params = ctx.request.body
      const black = await this.DBModule.User.findUser({ _id: params.createdBy })
      if(black.status == 'success'){
        if(black.data[0].blackMD == false ){
          let {
            createdBy = '-',
            author = '-',
            createdOn = '-',
            secret = '-',
            field = '-',
          } = params;
          const moduleObj = { createdBy,author,createdOn,secret,field };
          moduleObj.title = params.title.replace(/</g,'&lt;').replace(/>/g,'&gt;');
          moduleObj.body = params.body.replace(/</g,'&lt;').replace(/>/g,'&gt;');
          moduleObj.readNum = 0;
          const result = await this.DBModule.Blog.createBlogs(moduleObj)
          if(result.status == 'success'){
            ctx.body = { status: 200, msg: result.msg, data: result.data }
          }else{
            ctx.body = { status: 402, msg: result.msg }
          }
        }else{
          ctx.body = { status: 401, msg: '您被管理员封禁，不能发帖回帖，请联系管理员' }
        }
      }else{
        ctx.body = { status: 400, msg: '获取用户数据失败' }
      }
    }

    // 获取博客全部资源
    this.getBlogs = async(ctx, next) => {
      const params = ctx.request.body
      const result = await this.DBModule.Blog.findBlogs({ _id: params.bid })
      if(result.status == 'success'){
        if(result.data.length > 0){
          const num = result.data[0].readNum + 1
          await this.DBModule.Blog.updateBlogs({ _id: params.bid }, { readNum: num })
          let {
            createdBy = '-',
            author = '-',
            createdOn = '-',
            field = '-',
            secret = '-',
            commentNum = '-'
          } = result.data[0];
          const data = { createdBy,author,createdOn,field,secret,commentNum };
          data.title = result.data[0].title.replace(/&lt;/g,'<').replace(/&gt;/g,'>');
          data.body = result.data[0].body.replace(/&lt;/g,'<').replace(/&gt;/g,'>');
          data.readNum = result.data[0].readNum + 1;
          const comments = await this.DBModule.Dynamic.findDynamic({ blogId: params.bid });
          if(comments.status == 'success'){
            let arr = []
            for(let i=0;i<comments.data.length;i++){
              const user = await this.DBModule.User.findUser({ username: comments.data[i].author })
              let {
                author = '-',
                _id = '-',
                createdOn = '-',
                createdBy = '-',
                blogId = '-',
                reply = '-',
                up = '-',
                down = '-'
              } = comments.data[i];
              const replys = { author,_id,createdOn,createdBy,blogId,reply,up,down };
              replys.userImgURL = user.data[0].userImgURL;
              replys.body = comments.data[i].body.replace(/&lt;/g,'<').replace(/&gt;/g,'>');
              replys.index = i+1;
              for(let val of comments.data[i].reply ){
                const user = await this.DBModule.User.findUser({ _id: val.createdBy })
                val.userImgURL = user.data[0].userImgURL
              }
              arr.unshift(replys)
            }
            const authorObj = await this.DBModule.User.findUser({ _id: data.createdBy })
            const boke = await this.DBModule.Blog.findBlogs({ createdBy: data.createdBy })
            let {
              username = '-',
              userImgURL = '-',
              email = '-',
              starLen = '-',
              fansLen = '-'
            } = authorObj.data[0];
            const author = { username,userImgURL,email,starLen,fansLen };
            author.boke = boke.data;
            let isFans = false
            authorObj.data[0].fans.forEach(function (val, index) {
              if(val.userId == params.userId ){
                isFans = true
              }
            })
            ctx.body = { status: 200, msg: comments.msg, data: data, comment: arr, author: author, isFans: isFans }
          }else{
            ctx.body = { status: 401, msg: comments.msg }
          }
        }else{
          ctx.body = { status: 707, msg: '博客已经被删除' }
        }
      }else{
        ctx.body = { status: 400, msg: result.msg }
      }
    }

    // 删除博客
    this.removeBlogs = async(ctx, next) => {
      const params = ctx.request.body
      const blog = await this.DBModule.Blog.removeBlogs({ _id: params.blogId })
      const comment = await this.DBModule.Dynamic.removeDynamic({ blogId: params.blogId })
      if(blog.status=='success'&&comment.status=='success'){
        ctx.body = { status: 200, msg: '成功删除博客'}
      }else{
        ctx.body = { status: 400, msg: '删除博客失败'}
      }
    }

    // 搜索帖子
    this.searchBlogs = async(ctx, next) => {
      const params = ctx.request.body
      const result = await this.DBModule.Blog.findBlogs({ secret: false })
      if(result.status == 'success'){
        let arr = []
        result.data.forEach(function (val, index) {
          if(val.title.includes(params.search) || val.body.includes(params.search) || val.author.includes(params.search) ){
            arr.unshift(val)
          }
        })
        if(arr.length > 0){
          ctx.body = { status: 200, msg: result.msg, data: arr}
        }else{
          ctx.body = { status: 401, msg: '搜索不到相关的博文' }
        }
      }else{
        ctx.body = { status: 400, msg: '搜索出错' }
      }
    }

    // 发表回复
    this.createComment = async(ctx, next) => {
      const params = ctx.request.body
      const user = await this.DBModule.User.findUser({ username: params.author })
      const moduleObj = {
        createdBy: params.createdBy,
        createdOn: params.createdOn,
        author: params.author,
        body: params.comment.replace(/</g,'&lt;').replace(/>/g,'&gt;'),
        blogId: params.blogId,
        userImgURL: user.data[0].userImgURL,
        up: 0,
        down: 0,
        reply: [],
      }
      const result = await this.DBModule.Dynamic.createDynamic(moduleObj)
      if(result.status == 'success'){
        const blog = await this.DBModule.Blog.findBlogs({ _id: params.blogId })
        await this.DBModule.Blog.updateBlogs({ _id: params.blogId }, { commentNum: blog.data[0].commentNum+1 })
        let {
          _id = '-',
          createdBy = '-',
          createdOn = '-',
          author = '-',
          blogId = '-',
          reply = '-',
          up = '-',
          down = '-'
        } = result.data;
        const arr ={ _id,createdBy,createdOn,author,blogId,reply,up,down };
        arr.userImgURL = user.data[0].userImgURL;
        arr.body = result.data.body.replace(/&lt;/g,'<').replace(/&gt;/g,'>');
        ctx.body = { status: 200, msg: result.msg, data: arr }
      }else{
        ctx.body = { status: 400, msg: result.msg }
      }
    }

    // 删除回复
    this.removeComment = async(ctx, next) => {
      const params = ctx.request.body
      const result = await this.DBModule.Dynamic.removeDynamic({ _id: params.cid })
      const blog = await this.DBModule.Blog.findBlogs({ _id: params.bid })
      await this.DBModule.Blog.updateBlogs({ _id: params.bid }, { commentNum: blog.data[0].commentNum-1 })
      if(result.status == 'success'){
        const comments = await this.DBModule.Dynamic.findDynamic({ blogId: params.bid })
        let arr = []
        for(let i=0;i<comments.data.length;i++){
          const user = await this.DBModule.User.findUser({ username: comments.data[i].author })
          let {
            _id = '-',
            createdBy = '-',
            createdOn = '-',
            author = '-',
            blogId = '-',
            reply = '-',
            up = '-',
            down = '-'
          } = comments.data[i];
          const replys ={ _id,createdBy,createdOn,author,blogId,reply,up,down };
          replys.userImgURL = user.data[0].userImgURL;
          replys.body = comments.data[i].body.replace(/&lt;/g,'<').replace(/&gt;/g,'>');
          replys.index = i+1;
          for(let val of comments.data[i].reply ){
            const user = await this.DBModule.User.findUser({ _id: val.createdBy })
            val.userImgURL = user.data[0].userImgURL
          }
          arr.unshift(replys)
        }
        ctx.body = { status: 200, msg: '删除评论成功', data: arr }
      }else{
        ctx.body = { status: 400, msg: '删除评论失败' }
      }
    }

    // 发表回复
    this.createDynamic = async(ctx, next) => {
      const params = ctx.request.body
      const comment = await this.DBModule.Dynamic.findDynamic({ _id: params.commentId })
      if(comment.status == 'success'){
        const replys = comment.data[0].reply
        const user = await this.DBModule.User.findUser({ username: params.author })
        let {
          body = '-',
          author = '-',
          createdOn = '-',
          createdBy = '-',
          parentId = '-',
          prevMsg = '-',
          createdTo = '-'
        } = params;
        const replyObj = { body,author,createdOn,createdBy,parentId,prevMsg, createdTo };
        replyObj.userImgURL = user.data[0].userImgURL;
        replys.push(replyObj)
        await this.DBModule.Dynamic.updateDynamic({ _id: params.commentId}, { reply: replys })
        const result = await this.DBModule.Dynamic.findDynamic({ blogId: params.blogId })
        if(result.status == 'success'){
          let arr = []
          for(let val of result.data) {
            const user = await this.DBModule.User.findUser({_id: val.createdBy})
            const userImgURL = user.data[0].userImgURL
            let {
              createdOn = '-',
              createdBy = '-',
              author = '-',
              blogId = '-',
              reply = '-',
              up = '-',
              down = '-',
              _id = '-'
            } = val;
            const replys = { createdOn,createdBy,author,blogId,reply,up,down,_id };
            replys.userImgURL = userImgURL;
            replys.body = val.body.replace(/&lt;/g, '<').replace(/&gt;/g, '>');
            arr.unshift(replys)
          }
          ctx.body = { status: 200, msg: '回复成功', data: arr }
        }else{
          ctx.body = { status: 401, msg: '查询博客数据出错' }
        }
      }else{
        ctx.body = { status: 400, msg: '查询评论数据出错' }
      }
    }

    //  二维码
    this.qrcode = async(ctx, next) => {
      const params = ctx.request.body
      const result = await api.mkQrcode(params.url)
      if(result.status == 'success'){
        ctx.body = { status: 200, msg: result.msg, data: result.data }
      }else{
        ctx.body = { status: 400, msg: result.msg }
      }
    }

    // 点赞
    this.upComment = async(ctx, next) => {
      const params = ctx.request.body
      const result = await this.DBModule.Dynamic.updateDynamic({ _id: params.cid }, { up: params.up })
      if(result.status == 'success'){
        ctx.body = { status: 200, msg: '点赞成功' }
      }else{
        ctx.body = { status: 400, msg: '点赞失败' }
      }
    }

    // 点赞
    this.downComment = async(ctx, next) => {
      const params = ctx.request.body
      const result = await this.DBModule.Dynamic.updateDynamic({ _id: params.cid }, { down: params.down })
      if(result.status == 'success'){
        ctx.body = { status: 200, msg: '点赞成功' }
      }else{
        ctx.body = { status: 400, msg: '点赞失败' }
      }
    }

  }
}
