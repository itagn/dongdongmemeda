<template>
  <fl-oat>
    <div slot="floatContent" class="blog-home">
        <div class="blog-form">

          <div class="user">
            <div class="user-img">
              <img :src="user.userImgURL" @click="watchHome"/>
            </div>
            <div class="user-info">
              <div class="user-na">用户&nbsp;[<span>{{user.username}}</span>]</div>
              <div class="user-em">邮箱&nbsp;[<span>{{user.email}}</span>]</div>
              <div class="user-bl">黑名单&nbsp;[<span v-if="user.blackMD">封禁中</span><span v-if="!user.blackMD">安全</span>]</div>
            </div>
          </div>

          <el-form :model="blogForm" :rules="rules" ref="blogForm" label-width="100px" class="elform">
            <el-form-item prop="title">
              <span slot="label">博客标题</span>
              <el-input v-model="blogForm.title" class="input"></el-input>
            </el-form-item>
            <el-form-item prop="field">
              <span slot="label">博客区域</span>
              <el-select v-model="blogForm.field" placeholder="请选择活动区域" class="input">
                <el-option label="生活" value="生活"></el-option>
                <el-option label="工作" value="工作"></el-option>
                <el-option label="福利" value="福利"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="secret">
              <span slot="label">设为私密</span>
              <el-switch on-text="" off-text="" v-model="blogForm.secret"></el-switch>
            </el-form-item>
            <el-form-item prop="body">
              <span slot="label">博客内容</span>
              <el-input type="textarea" v-model="blogForm.body" :autosize="{ minRows: 8 }" class="input"></el-input>
              <div class="tool">
                已输入 <span class="i">{{blogForm.body.length}}</span> 字数
              </div>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('blogForm')">立即创建</el-button>
              <el-button @click="resetForm('blogForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>

        <div class="xiaoguo">
          <div class="b-title">
            {{blogForm.title}}
          </div>
          <div class="b-field">
            <span v-if="blogForm.title">博主（{{user.username}}）</span>
          </div>
          <pre class="b-body">{{blogForm.body}}</pre>
        </div>
    </div>
  </fl-oat>
</template>
<script>
  import flOat from '../Float.vue'
  export default {
    data(){
      return {
        user: {
          username: '',
          userId: '',
          email: '',
          createdOn: '',
          rooter: '',
          blackMD: '',
          blackTime: '',
          userImgURL: '',
        },
        blogForm: {
          title: '',
          field: '',
          secret: false,
          body: '',
        },
        rules: {
          title: [
            { required: true, message: '请填写博客标题', trigger: 'blur' },
            { max: 30, message: '博客标题不要超过30个字', trigger: 'blur|change' }
          ],
          field: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ],
          body: [
            { required: true, message: '请填写博客内容', trigger: 'blur' }
          ]
        },
        blogTxt: '',
      }
    },
    mounted: function () {
      const storage = JSON.parse(window.sessionStorage.getItem('user'))
      if(storage){
        this.user = storage
      }else{
        this.errMsg('游客你是不是走错路了？')
        this.$router.push({ path: '/home' })
      }
    },
    components: {
      flOat,
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
      // 发表博客
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const date = new Date()
            const timer = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
              const data = {
                title: this.blogForm.title,
                body: this.blogForm.body,
                author: this.user.username,
                field: this.blogForm.field,
                secret: this.blogForm.secret,
                createdBy: this.user.userId,
                createdOn: timer,
              }
              this.$http.post('/blog/create', data).then((res, req) => {
                if(res.body.status == 200){
                  this.succMsg('快去看看别人这么评价你博文的')
                  this.resetForm(formName)
                }else{
                  this.errMsg(res.body.msg)
                }
              })
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      watchHome: function () {
        this.$router.push({ name: 'user', query: { uid: this.user.userId } })
      }
    },
  }
</script>
<style lang="less">
  @user-height: 130px;
  .blog-home{
    position: relative;
    width: 100%;
    min-height: 100%;
    .blog-form{
      position: relative;
      float: left;
      width: 45%;
      min-height: 100%;
      padding-right: 5.5%;
      border-right: 2px solid #666;
      .user{
        position: relative;
        margin-top: 6%;
        width: 100%;
        height: @user-height;
        .user-img{
          height: @user-height;
          display: inline-block;
          img{
            position: absolute;
            left: 5%;
            width: 100px;
            height:100px;
            border-radius: 10px;
            cursor: pointer;
          }
        }
        .user-info{
          height: @user-height;
          position: absolute;
          top: 0;
          left: 30%;
          .user-na, .user-em, .user-bl{
            text-align: left;
            margin-top: 4%;
            color: #999;
          }
          .user-na{
            span{
              color: #5d95ea;
            }
          }
          .user-em{
            span{
              color: #5d95ea;
            }
          }
          .user-bl{
            span{
              color: red;
            }
          }
        }
      }
      .elform{
        margin-top: 0%;
        .tool{
          position: relative;
          left: 42%;
          bottom: 0;
          height: 10px;
          .i{
            color: orange;
          }
        }
      }
      .input{
        width: 100%;
        font-size: 14px;
      }
    }
    .xiaoguo{
      float: left;
      position: relative;
      min-height: 100%;
      top: 0%;
      left: 7%;
      width: 35%;
      .b-title{
        font-size: 26px;
        margin-top: 60px;
        width: 100%;
        color: #5d95ea;
      }
      .b-field{
        font-size: 14px;
        margin-top: 10px;
      }
      .b-body{
        position: relative;
        color: olivedrab;
        font-size: 18px;
        text-align: left;
        width: 100%;
        font-family: 'Helvetica Neue',Helvetica,'PingFang SC','Hiragino Sans GB','Microsoft YaHei',Arial,sans-serif;
        word-wrap: break-word;
        white-space: pre-wrap;
      }
    }
  }
</style>
