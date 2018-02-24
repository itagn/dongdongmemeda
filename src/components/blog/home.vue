<template>
  <lay-out @message="message">
    <div slot="content" class="home">
        <div class="user">
          <div class="user-info">
            <div class="user-img">
              <el-upload
                :action="actionURL"
                :data="uploadData"
                :show-file-list="false"
                :before-upload="checkFile"
                :on-success="faceU">
                <img :src="userImgURL" alt="用户头像" title="用户头像" />
              </el-upload>
            </div>
            <div class="user-name" :data-uid="user.userId" :data-rooter="user.rooter">{{user.username}}</div>
            <div class="user-blog" v-if="user.isShow">
              <h5>博文数量: <span>{{user.blogNum}}</span></h5>
              <div class="user-fs">
                <span class="fs">关注: <span>{{user.starLen}}</span></span>
                <span class="fs">粉丝: <span>{{user.fansLen}}</span></span>
              </div>
              <el-button @click="createBlogs" >写博客</el-button>
              <br/><br/>
              <el-button @click="userHome" >我的空间</el-button>
              <span v-if="user.rooter=='admin'">
                <br/><br/>
                <el-button @click="manager" >管理用户</el-button>
              </span>
            </div>
          </div>
        </div>

        <div class="blogs">
          <div class="blogs-content" v-if="blogs.length>0">

            <div class="blogs-ul">
              <div class="blogs-li" v-for="blog in blogs"
                   :data-cid="blog._id"@click="blogURL(blog._id)">
                <div class="blog-image">
                  <span class="blog-title" title="博客标题"><span style="color: #00B7FF;">【{{blog.field}}】</span>{{blog.title}}</span>
                  <span class="blog-author" title="博主">博主：&nbsp;{{blog.author}}</span>
                </div>
                <div class="blogs-list">
                  <span class="blog-title" title="博客标题">{{blog.title}}</span>
                  <div class="blog-body" title="博客内容">{{blog.body}}</div>
                  <span class="blog-author" title="博主">博主：&nbsp;{{blog.author}}</span>
                  <span class="blog-comment">
                    <img src="../../assets/comment.png"/>&nbsp;<span>{{blog.commentNum}}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="create-title">
              <h1>首页还没有文章，快来发表吧~</h1>
            </div>
            <div class="create-blog" @click="createBlogs">
              <i class="el-icon-plus"></i>
            </div>
          </div>
        </div>

      <el-pagination
        small
        layout="prev, pager, next, jumper"
        :total="page"
        @current-change="pageInfo"
        class="blogs-page">
      </el-pagination>

        <div class="news">
          <div class="hot-blog">
            <h2>热门文章</h2>
            <ol v-if="blogs.length > 0">
              <li v-for="blog in hotBlogs">
                <a @click="runToBlogs(blog._id)" class="remen">{{blog.title}}</a>
              </li>
            </ol>
          </div>
          <div class="blog-field">
            <h2>博客区域</h2>
            <ul>
              <li><a >全部</a></li>
              <li><a >生活</a></li>
              <li><a >工作</a></li>
              <li><a >福利</a></li>
            </ul>
          </div>
        </div>
    </div>
  </lay-out>
</template>
<script>
  import layOut from '../Layout.vue'
  import info from '../../../config/info'
export default {
  data(){
    return {
      actionURL: `${info.serverAddress.url}/user/faceU`,
      userImgURL: '',
      user: {
        username: '',
        userId: '',
        rooter: 'other',
        blogNum: 0,
        isShow: '',
      },
      blogs: [],
      page: 10,
      pageTotal: 9,
      hotBlogs: [],
    }
  },
  mounted: function () {
    const storage = JSON.parse(window.sessionStorage.getItem('user'))
    if(storage){
      this.user = storage
      this.user.isShow = true
    }else{
      this.user = {
        username: '游客',
        userId: 'other',
        isShow: false,
      }
    }
    this.pageInfo(1)
  },
  computed: {
    uploadData() {
      return { 'username': this.user.username }
    }
  },
  components: {
    layOut,
  },
  methods: {
    // 失败的提示消息
    errMsg: function (str) {
      this.$message({
        showClose: true,
        message: str,
        type: 'error'
      });
    },
    // 成功的提示消息
    succMsg: function (str) {
      this.$message({
        showClose: true,
        message: str,
        type: 'success'
      });
    },
    message: function (data) {
      this.blogs = data
    },
    // 请求页面信息
    pageInfo: function (num) {
      const data = {
        username: this.user.username,
        secret: false,
        page: num,
        userId: this.user.userId,
      }
      this.$http.post('/blog/findAll', data).then(function (res, req) {
        if(res.body.status == '200'){
          if(res.body.data.userImgURL != ''){
            if(res.body.data.rooter == 'admin'){
//              this.succMsg(`欢迎管理员  ${this.user.username}`)
              this.user.rooter = 'admin'
            }else{
              this.user.rooter = 'other'
            }
            this.user.fansLen = res.body.data.fansLen
            this.user.starLen = res.body.data.starLen
            this.user.blogNum = res.body.data.myBlogNum
            this.userImgURL = res.body.data.userImgURL
          }else{
            this.userImgURL = `../../../static/user/user.jpg`
          }
          this.blogs = res.body.data.resBlog
          this.hotBlogs = res.body.data.resBlog
          this.page = res.body.data.total
        }else{
          this.errMsg(res.body.msg)
        }
      })
    },

    blogURL: function (bid) {
      this.$router.push({ name: 'blog', query: { bid: bid }})
    },
    // 管理员权限
    manager: function () {
      if(this.user.rooter == 'admin'){
        this.$router.push({ path: '/root' })
      }else{
        this.errMsg('游客你是不是走错路了？')
      }
    },
    // 进入用户个人空间
    userHome: function () {
      if(this.user.username != '游客'){
        this.$router.push({ name: 'user', query: { uid: this.user.userId } })
      }else{
        this.errMsg('游客你是不是走错路了？')
      }
    },
    // 检查上传头像格式
    checkFile: function (file) {
      if(this.user.username != '游客'){
        const fileArr = file.name.split('.')
        const fileType = fileArr[fileArr.length-1].toLocaleLowerCase()
        const allow = ['png', 'jpg']
        if(!allow.includes(fileType)){
          this.errMsg('只认PNG/JPG兄弟')
          return false
        }
      }else if(this.user.username == '游客'){
        this.errMsg('游客当然不能更换头像了')
        return false
      }
    },
    // 头像上传成功触发
    faceU: function (response) {
      if(response.status == 200){
        this.userImgURL = response.data
        this.succMsg('看起来我更帅了？')
        const data = {
          userId: this.user.userId,
        }
        this.$http.post('/user/find', data).then((res, req) => {
          if(res.body.status == 200){
            window.sessionStorage.setItem('user', JSON.stringify(res.body.data))
          }else if(res.body.status == 401){
            this.succMsg('欢迎游客')
          }else{
            this.errMsg(res.body.msg)
          }
        })
      }else{
        this.errMsg(response.msg)
      }
    },
    // 写博客
    createBlogs: function () {
      this.$router.push({ path: '/create' })
    },
    // 热门文章
    runToBlogs: function (bid) {
      this.$router.push({ name: 'blog', query: { bid: bid } })
    },

  },

}
</script>
<style lang="less">
  .box(@width, @height){
    position: relative;
    width: @width;
    height: @height;
    left: 0;
    top: 0;
    float: left;
  }
  .center (@width, @height){
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: @width;
    height: @height;
  }
  .home{
    position: relative;
    width: 100%;
    height: 100%;
    .user{
      margin: 10px 0 0 0;
       .box(15%, 100%);
      .user-info{
        position: relative;
        background-color: antiquewhite;
        border: 2px solid #999;
        border-radius: 10px;
        left: 10%;
        width: 80%;
        height: 100%;
        min-height: 340px;
        max-height: 400px;
        button{
          border-radius: 10px;
        }
        .user-img{
          position: relative;
          top: 20px;
          img{
            cursor: pointer;
            width: 64px;
            height: 64px;
            border-radius: 10px;
            border: 1px solid #999;
          }
        }
        .user-name{
          position: relative;
          margin-top:30px;
          color: olivedrab;
        }
        .user-blog{
          position: relative;
          height: 30px;
          .user-fs{
            font-size: 15px;
            margin: 0 0 20px 0;
            .fs{
              margin-left: 10px;
              span{
                color: #00B7FF;
              }
            }

          }
        }
      }
    }

    .blogs{
        margin: 10px 10px 60px 10px;
       .box(64%, 100%);
      .blogs-content{
        width: 100%;
        height: 100%;
        .blogs-ul{
          position: relative;
          width: 100%;
          height: 100%;
          left: 0;
          right: 0;
          margin: 0 auto;
          .blogs-li{
            position: relative;
            float: left;
            top: 0;
            left: 0;
            width: 32%;
            height: 30%;
            border-radius: 10px;
            border: 1px solid #fff;
            cursor: pointer;
            overflow: hidden;
            &:hover{
              .blog-image, .blogs-list{
                transition: 1s;
                transform: translateY(-100%);
              }
            }
            .blog-image{
              position: relative;
              width: 100%;
              height: 100%;
              /*background-color: #ccc;*/
              background-image: url('../../assets/bk.jpg');
              background-size: 100% 100%;
              .blog-title{
                position: relative;
                text-align: left;
                overflow: hidden;
                top: 9%;
                left: 9%;
                font-size: 28px;
                color: #000;
                background-color: #F7FAFC;
                border-radius: 5px;
                width: 84%;
                word-break:break-all;
                display: -webkit-box;
                overflow : hidden;
                text-overflow: ellipsis;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
              }
              .blog-author{
                position: absolute;
                left: 10px;
                bottom: 10px;
                font-size: 14px;
                color: #fff;
              }
            }
            .blogs-list{
              position: relative;
              width: 100%;
              height: 100%;
              background-color: #ccc;
              .blog-title, .blog-body{
                text-align: left;
                overflow: hidden;
              }
              .blog-title{
                position: relative;
                top: 10px;
                left: 5%;
                font-size: 30px;
                color: #5d95ea;
                width: 60%;
                word-break:break-all;
                display: -webkit-box;
                overflow : hidden;
                text-overflow: ellipsis;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
              }
              .blog-body{
                position: relative;
                top: 20px;
                left: 5%;
                text-align: left;
                font-size: 14px;
                color: olivedrab;
                width: 90%;
                word-break:break-all;
                display: -webkit-box;
                overflow : hidden;
                text-overflow: ellipsis;
                -webkit-line-clamp: 5;
                -webkit-box-orient: vertical;
              }
              .blog-author{
                position: absolute;
                left: 10px;
                bottom: 10px;
                font-size: 14px;
                color: #000;
              }
              .blog-comment{
                position: absolute;
                right: 30px;
                bottom: 7px;
                font-size: 14px;
                color: #000;
              }
            }
          }
        }
      }
      .create-title{
        position: absolute;
        left: 0 ;
        right: 0;
        top: 5%;
        margin: auto;
        color: #8c939d;
      }
      .create-blog{
        position: relative;
        left: 0;
        right: 0;
        top: 200px;
        margin: auto;
        width: 100px;
        height: 100px;
        border: 2px dashed #ccc;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.5s;
        &:hover{
          border-color: #8c939d;
        }
        i{
          .center(20px, 20px);
          color: #8c939d;
        }
      }
    }

    .blogs-page{
      position: absolute;
      bottom: 1%;
      left: 0;
      right: 0;
      margin: 0 auto;
    }

    .news{
      .box(13%, 100%);
      .hot-blog{
        ol{
          color: #00B7FF;
          width: 99%;
          li{
            width: 100%;
            text-align: left;
            margin-top: 5%;
            word-break:break-all;
            text-overflow: ellipsis;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            .remen{
              cursor: pointer;
              text-decoration: none;
              &:hover{
                text-decoration: underline;
              }
            }
          }
        }
      }

      .blog-field{
        position: absolute;
        bottom: 30px;
        width: 100%;
        ul{
          list-style: none;
          width: 100%;
          position: relative;
          left: -40px;
          li{
            width: 100%;
            cursor: pointer;
            text-align: center;
            a{
              color: orange;
              font-size: 20px;
              text-decoration: none;
            }
          }
        }
      }
    }
  }
</style>
