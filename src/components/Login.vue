<template>
  <div class="content">
    <div class="login-content">

      <div class="login-box">
        <div class="login-form">
          <div class="title">东东么么哒</div>
          <div class="body">
            <el-tabs type="card" @tab-click="toggleTo" v-model="tab">
              <el-tab-pane name="log">
                <span slot="label"><i class="el-icon-star-on" v-if="allow.isLogin"></i> 登录</span>
              </el-tab-pane>
              <el-tab-pane name="reg">
                <span slot="label"><i class="el-icon-star-on" v-if="allow.isReg"></i> 注册</span>
              </el-tab-pane>
            </el-tabs>
            <div v-if="allow.isLogin" class="log-box">
              <el-input v-model="login.username" class="login-user" @blur="firstYzm" ></el-input>
              <el-input v-model="login.password" type="password" class="login-password"></el-input>
              <el-input v-model="login.myYzm" placeholder="验证码" class="login-yzm" @blur="logYzm" @keyup.enter.native="enterSignIn"></el-input>
              <canvas id="canvasYZM" class="login-yzm-img" @click="getYzm">{{login.yzm}}</canvas>
              <a class="login-forget" @click="forgetPass" >找回密码</a>
              <a class="login-youke" @click="youke">游客通道</a>
              <el-button type="primary" class="form-login" @click="signIn" :loading="login.loading">登录</el-button>
            </div>

            <div v-if="allow.isReg" class="reg-box">
              <el-form label-width="100px" :model="register" ref="register">
                <el-form-item
                  prop="username"
                  label="用户名"
                  v-if="register.step == 1"
                  :rules="[{ required: true, message: '请输入用户名', trigger: 'blur' }]">
                  <el-input v-model="register.username" class="reg-user" @blur="regUser"></el-input>
                </el-form-item>
                <el-form-item
                  prop="password"
                  label= "新密码"
                  v-if="register.step == 1"
                  :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
                  <el-input v-model="register.password" type="password" class="reg-password"></el-input>
                </el-form-item>
                <el-form-item
                  prop="repassword"
                  label= "确认密码"
                  v-if="register.step == 1"
                  @keyup.enter.native="register.step=2"
                  :rules="[{ required: true, message: '请再次输入密码', trigger: 'blur' }]">
                  <el-input v-model="register.repassword" type="password" class="reg-repassword"></el-input>
                </el-form-item>
                <el-form-item
                  prop="email"
                  label="邮箱"
                  v-if="register.step == 2"
                  :rules="[{ required: true, message: '请输入邮箱地址', trigger: 'blur' },
                      { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }]">
                  <el-input v-model="register.email" class="reg-email" @blur="regEmail"></el-input>
                </el-form-item>
                <el-form-item
                  prop="yaoqing"
                  label="邀请码"
                  v-if="register.step == 2"
                  @keyup.enter.native="enterSignUp('register')"
                  :rules="[{ required: true, message: '请输入邀请码', trigger: 'blur' }]">
                  <el-input v-model="register.yaoqing" class="reg-yaoqing"></el-input>
                </el-form-item>
                <el-form-item class="reg-button">
                  <el-button class="reg-button-next" v-if="register.step == 1"
                              @click="signUpNext">下一步</el-button>
                  <el-button class="reg-button-prev" v-if="register.step == 2"
                              @click="signUpPrev">上一步</el-button>
                  <el-button class="reg-button-submit" v-if="register.step == 2" type="primary" :loading="register.loading" @click="signUp('register')">注册</el-button>
                  <el-button class="reg-button-reset" v-if="register.step == 1" type="primary" @click="resetForm">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mask" v-if="allow.isMask"></div>
    <div class="forget-box" v-if="allow.isForget">
      <el-steps :space="100" :active="active" finish-status="success" class="step-box">
        <el-step title="步骤 1"  description="邮箱发送验证码"></el-step>
        <el-step title="步骤 2" description="修改密码"></el-step>
        <el-step title="步骤 3" description="重置密码成功"></el-step>
      </el-steps>
      <div class="forget-content">
        <div v-if="active==0||active==1" class="step-one">
          <el-input v-model="forget.username" placeholder="用户名" class="forget-username" @blur="forgetUsername" @keyup.enter.native="enterEmail"></el-input>
          <el-input v-model="forget.auth" placeholder="验证码" class="forget-auth" v-if="!allow.isSend" @blur="forgetAuth" @keyup.enter.native="enterAuth"></el-input>
          <el-button class="send-button" @click="sendEmail" v-if="allow.isSend":loading="forget.emailLoading">发送验证码</el-button>
          <el-button class="next-button" @click="sendAuth" v-if="allow.isSure":loading="forget.authLoading">确认</el-button>
          <el-button class="cancel-button" @click="stepCancel" v-if="allow.isReset">取消</el-button>
        </div>
        <div v-if="active==2" class="step-two">
          <el-input v-model="forget.password" type="password" placeholder="新密码" class="forget-password"></el-input>
          <el-input v-model="forget.repassword" type="password" placeholder="确认密码" class="forget-repassword" @keyup.enter.native="enterPassword"></el-input>
          <el-button class="next-button" @click="sendPassword" v-if="allow.isSure":loading="forget.passLoading">确认</el-button>
          <el-button class="cancel-button" @click="stepCancel" v-if="allow.isReset">取消</el-button>
        </div>
        <div v-if="active==3" class="step-three">
          <div class="forget-ok">修改完成</div>
        </div>
      </div>
      <el-button class="ok-button" @click="closeMask" v-if="!allow.isReset">完成</el-button>
    </div>

    <div class="body">
      <canvas id="canvas"></canvas>
    </div>
  </div>

</template>

<script>
  import caidong from '../common/caidong.js'
  import background from '../common/background.js'
  export default {
    data(){
      return {
        tab: 'log',
        allow: { // 需要确认的元素
          isMask: false,
          isForget: false,
          isLogin: true,
          isReg: false,
          isReset: true,
          isSend: true,
          isSure: false,
        },
        login: {  // 登录的元素
          username: '',
          password: '',
          myYzm: '',
          loading: false,
          yzm: '', // 生成的验证码
        },
        active: 0,
        forget: { // 忘记密码的元素
          username: '',
          auth: '',
          password: '',
          repassword: '',
          emailLoading: false,
          authLoading: false,
          passLoading: false,
        },
        register: { // 注册的元素
          username: '',
          password: '',
          repassword: '',
          email: '',
          yaoqing: '',
          loading: false,
          step: 1,
        },
      }
    },
    beforeCreate: function () {
      const data = {}
      this.$http.post('/addAdmin', data).then((res, req) => {
        if(res.body.status == 200){
          caidong.desc()
        }else if(res.body.status == 201){
          caidong.desc()
          console.log('初始化完成，成功创建管理员')
        }else{
          this.errMsg('初始化出错')
        }
      })
    },
    mounted: function () {
      const canvas = document.getElementById('canvas')
      const [WIDTH, HEIGHT, maxR, minR] = [window.innerWidth, window.innerHeight, 15, 5]
      let POINT = 35
      if(window.innerWidth<780){
          POINT = 15
      }else if(window.innerWidth<1280){
          POINT = 25
      }
      const bk = new background(canvas, WIDTH, HEIGHT, POINT, maxR, minR)
      bk.run()
    },
    methods: {
      // 切换登录和注册和邀请码
      toggleTo : function (tab) {
        if(tab.name == 'reg'){
          this.allow.isLogin = false
          this.allow.isReg = true
          this.login = {  // 登录的元素
              username: '',
              password: '',
              myYzm: '',
              loading: false,
              yzm: '', // 生成的验证码
          }
        }else if(tab.name == 'log'){
          this.allow.isLogin = true
          this.allow.isReg = false
          this.register = { // 注册的元素
              username: '',
              password: '',
              repassword: '',
              email: '',
              yaoqing: '',
              loading: false,
              step: 1,
          }
        }
      },
      // 重置
      resetForm: function () {
        this.register = {
            username: '',
            password: '',
            repassword: '',
            email: '',
            yaoqing: '',
            loading: false,
            step: 1,
        }
      },
      // 第一次获取验证码
      firstYzm: function () {
        if(this.login.username.trim() != ''){
          if(this.login.yzm == ''){
            this.getYzm()
          }
        }else{
          this.login.username = ''
        }
      },
      // 获取验证码
      getYzm: function () {
        if(this.login.username){
          const yzm = Math.random().toString(16).slice(2, 6)
          this.login.yzm = yzm
          const canvas = document.getElementById('canvasYZM')
          const context = canvas.getContext('2d')
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.font = "120px 微软雅黑";
          context.fillText(yzm, 5, 130);
        }
      },
      enterSignIn: function () {
        if(this.login.myYzm.length==4){
          this.signIn()
        }else{
          this.errMsg('验证码是标准的4位身材')
        }
      },
      // 登录操作
      signIn: function () {
        const _ = this
        if(this.login.username){
          if(this.login.password){
            if(this.login.myYzm){
              if(this.login.myYzm == this.login.yzm){
                this.login.loading = true;
                const form = {
                  username: this.login.username,
                  password: this.login.password,
                }
                this.$http.post('/signIn', form).then((res, req) => {
                  this.login.loading = false
                  if(res.body.status == 200){
                    _.$store.commit('updateUser', res.body.data) // 保存状态到vuex
                    window.sessionStorage.setItem('user', JSON.stringify(res.body.data)) // 保存到sessionStorage
                    this.succMsg('这不是你的魔仙堡')
                    this.login = {
                      username: '',
                      password: '',
                      myYzm: '',
                      yzm: '',
                    }
                    setTimeout(function () {
                      _.$router.push({ path: '/home' });
                    }, 1000);
                  }else{
                    this.errMsg(res.body.msg);
                    this.getYzm();
                    this.login.myYzm = '';
                  }
                })
              }else{
                this.errMsg('验证码口令对不上');
                this.getYzm();
                this.login.myYzm = '';
              }
            }else{
              this.errMsg('验证码看右边');
            }
          }else{
            this.errMsg('密码忘记输了');
          }
        }else{
          this.errMsg('用户名？');
        }
      },
      // 打开忘记密码模块
      forgetPass: function () {
        this.allow.isMask = true
        this.allow.isForget = true
      },
      checkName: function(str){
        if(str.length < 11){
          const exp = new RegExp('^[a-zA-Z0-9_\u4e00-\u9fa5]+$')
          const us = exp.test(str)
          if(us){
            return true
          }else{
            this.errMsg('用户名只能由中文、数字、英文字母或者下划线组成')
            return false
          }
        }else{
          this.errMsg('用户名超过10位了让我怎么记')
          return false
        }
      },
      // 密码进行检测，长度为6-20位，只能由下划线、数字、英文字母组成
      checkPass: function(str){
        if(str.length < 21){
          if(str.length > 5){
            const exp = new RegExp('^\\w+$')
            const ps = exp.test(str)
            if(ps){
              return true
            }else{
              this.errMsg('密码只能由数字、英文字母或者下划线组成')
              return false
            }
          }else{
            this.errMsg('密码少于6位被偷了不负责哦')
            return false
          }
        }else{
          this.errMsg('密码超过20位了我记不住哈')
          return false
        }
      },
      // 注册中
      signUpNext: function () {
        this.register.step++
      },
      // 注册中
      signUpPrev: function () {
        this.register.step--
      },
      enterSignUp: function (form) {
        this.signUp(form)
      },
      // 注册
      signUp: function (form) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            if(this.register.password == this.register.repassword){
              const us = this.checkName(this.register.username)
              if (us) {
                const pa = this.checkPass(this.register.password)
                if (pa) {
                  this.register.loading = true
                  const form = {
                    username: this.register.username,
                    password: this.register.password,
                    email: this.register.email,
                    yaoqing: this.register.yaoqing,
                  }
                  this.$http.post('/signUp', form).then((res, req) => {
                    this.register.loading = false
                    if (res.body.status == 200) {
                      this.succMsg('恭喜入坑，反正账号你也删不掉了')
                      this.allow.isLogin = true
                      this.allow.isReg = false
                      this.tab = 'log'
                      this.register = {
                        username: '',
                        password: '',
                        repassword: '',
                        email: '',
                        yaoqing: '',
                        step: 1,
                      }
                    } else {
                      this.errMsg(res.body.msg)
                    }
                  })
                }
              }
            }else{
              this.errMsg('密码如果不一样，应该保存哪个呢？')
            }
          } else {
            return false
          }
        })
      },
      // 关闭遮幕层
      closeMask: function () {
        this.stepCancel()
        this.allow.isReset = true
        this.allow.isSend = true
      },
      // 忘记密码取消按钮
      stepCancel: function () {
        this.allow.isForget = false
        this.allow.isMask = false
        this.allow.isSend = true
        this.allow.isSure = false
        this.active = 0
        this.forget = {
          username: '',
          auth: '',
          password: '',
          repassword: '',
        }
      },
      // 验证邮箱格式
      checkEmail: function (email) {
        const check = new RegExp("[\\w!#$%&'*+/=?^_`{|}~-]+(?:\\.[\\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\\w](?:[\\w-]*[\\w])?\\.)+[\\w](?:[\\w-]*[\\w])?")
        return check.test(email)
      },
      enterEmail: function () {
        this.sendEmail()
      },
      enterAuth: function () {
        this.sendAuth()
      },
      enterPassword: function () {
        this.sendPassword()
      },
      // 给邮箱发送验证码
      sendEmail: function () {
        // 正则验证用户名
        const result = this.checkName(this.forget.username)
        if(result){
          this.forget.emailLoading = true
          const data = {
            username: this.forget.username,
          }
          this.$http.post('/forget/sendEmail', data).then((res, req) => {
            this.forget.emailLoading = false
            if(res.body.status == 200){
              this.active++
              this.allow.isSend = false
              this.allow.isSure = true
              this.succMsg('快去看看给你邮箱发的情书')
            }else{
              this.errMsg(res.body.msg)
            }
          })
        }else{
          this.errMsg('这怕不是邮箱吧')
        }
      },
      // 发送验证码比对
      sendAuth: function () {
        this.forget.authLoading = true
        const data = {
          username: this.forget.username,
          auth: this.forget.auth,
        }
        this.$http.post('/forget/sendAuth', data).then((res, req) => {
          this.forget.authLoading = false
          if(res.body.status == 200){
            this.active++
          }else{
            this.errMsg(res.body.msg)
          }
        })
      },
      // 重置密码
      sendPassword: function () {
        if(this.forget.password == this.forget.repassword){
          const pa = this.checkPass(this.forget.password)
          if(pa){
            this.forget.passLoading = true
            const data = {
              username: this.forget.username,
              password: this.forget.password,
            }
            this.$http.post('/forget/sendPassword', data).then((res, req) => {
              if(res.body.status == 200){
                this.active++
                this.allow.isSure = false
                this.allow.isReset = false
              }else{
                this.errMsg(res.body.msg)
              }
            })
          }
        }else{
          this.errMsg('密码如果不一样，应该保存哪个呢？')
        }
      },
      // 清空表框
      logYzm: function () {
        if(this.login.myYzm.trim() == ''){
          this.login.myYzm = ''
        }
      },
      youke: function () {
        const _ = this
        _.$router.push({ path: '/home' })
      },
      forgetUsername: function () {
        if(this.forget.username.trim() == ''){
          this.forget.username = ''
        }
      },
      forgetAuth: function () {
        if(this.forget.auth.trim() == ''){
          this.forget.auth = ''
        }
      },
      regUser: function () {
        if(this.register.username.trim() == ''){
          this.register.username = ''
        }
      },
      regEmail: function () {
        if(this.register.email.trim() == ''){
          this.register.email = ''
        }
      },


    },
  }
</script>
<style lang="less">
  @scroll-width: 70%;
  @text-indent: 35px;
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

  .content{
    width: 100%;
    height: 100%;
    .body{
      width: 100%;
      margin: 0;
      padding: 0;
      overflow: hidden;
    }
    .mask{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.4);
      z-index: 1000;
    }

    .forget-box{
      .center(375px, 354px);
      background-color: #FFF;
      z-index: 2000;
      border-radius: 20px;
      min-height: 370px;
      min-width: 325px;
      .step-box{
        position: absolute;
        top: 10%;
        left: 0;
        right: 0;
        margin: 0 auto;
      }
      .forget-content{
        background-color: darkslategrey;
        position: absolute;
        top: 35%;
        bottom: 25%;
        left: 0;
        width:100%;
        .step-one{
          .forget-username, .forget-auth{
            position: absolute;
            left: 20%;
            width: 60%;
          }
          .forget-username{
            top: 20%;
          }
          .forget-auth{
            top: 55%;
          }
        }
        .step-two{
          .forget-password, .forget-repassword{
            position: absolute;
            left: 20%;
            width: 60%;
          }
          .forget-password{
            top: 20%;
          }
          .forget-repassword{
            top: 55%;
          }
        }
        .step-three{
          .forget-ok{
            .center(20%, 15%);
            font-size: 18px;
            color: #fff;
          }
        }
      }
      .next-button{
        position: absolute;
        left: 36%;
        top: 110%;
      }
      .send-button{
        position: absolute;
        left: 23%;
        top: 110%;
      }
      .ok-button{
        position: absolute;
        left: 40%;
        bottom: 40px;
      }
      .cancel-button{
        position: absolute;
        left: 52%;
        top: 110%;
      }
    }

    .login-content{
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0px;
      width: 100%;
      height: 100%;
      overflow: hidden;

      .login-box{
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        .login-form{
          .center(334px, 354px);
          font-family: 'Helvetica Neue',Helvetica,'PingFang SC','Hiragino Sans GB','Microsoft YaHei',Arial,sans-serif;
          .title{
            position: relative;
            left: 0;
            right: 0;
            margin: 0 auto;
            top: 0;
            color: #555;
            font-size: 30px;
            font-weight: 400;
          }

          .body{
            margin-top: 30px;
            position: relative;
            border: 1px solid #ccc;
            border-radius: 6px;
            width: 334px;
            height: 334px;
            background: #fff;
            .log-box{
              margin-top: 20px;
              .login-user, .login-password{
                position: absolute;
                left: 30px;
                text-indent: @text-indent;
                display: block;
                width: 66%;
              }
              .login-user{
                top: 80px;
                background: url("../assets/username.png") 5px no-repeat;
              }
              .login-password{
                top: 130px;
                background: url("../assets/password.png") 5px no-repeat;
              }
              .login-yzm, .login-yzm-img{
                position: absolute;
                top: 180px;
                display: inline-block;
                width: 30%;
              }
              .login-yzm{
                left: 30px;
                text-indent: @text-indent;
                background: url("../assets/email.png") 5px no-repeat;
              }
              .login-yzm-img{
                left: 182px;
                border-radius: 5px;
                height: 34px;
                border: 1px solid #666;
                cursor: pointer;
              }
              a{
                position: absolute;
                text-decoration: none;
                cursor: pointer;
                display: inline-block;
                color: #2E7FDB;
                top: 235px;
                &:hover{
                  text-decoration: underline;
                }
              }
              .login-forget{
                left: 36px;
              }
              .login-youke{
                left: 226px;
              }
              .form-login{
                position: absolute;
                width: 120px;
                bottom: 25px;
                left: 0;
                right: 0;
                margin: auto;
              }
            }
            .reg-box{
              position: relative;
              width: 100%;
              height: 100%;
              margin-top: 20px;
              .reg-user, .reg-password, .reg-repassword, .reg-email, .reg-yaoqing{
                position: absolute;
                display: block;
                width: 80%;
              }
              .el-form-item__label{
                color: #999;
              }
              .reg-button{
                position: absolute;
                width: 100%;
                top: 65%;
                .reg-button-next, .reg-button-prev, .reg-button-reset, .reg-button-submit{
                  position: absolute;
                  top: -20px;
                  width: 100px;
                }
                .reg-button-submit, .reg-button-reset{
                  left: 80px;
                }
                .reg-button-prev, .reg-button-next{
                  left: -30px;
                }
              }
            }
          }
        }
      }
    }
  }

</style>

