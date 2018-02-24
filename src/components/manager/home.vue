<template>
  <lay-out>
    <div slot="content" class="manager">

      <div class="yaoqing">
        <div class="yaoqing-field">
          <div>邀请码区域</div>
          <div class="ran">
            <el-button @click="setYaoqing" type="primary">随机生成邀请码</el-button>
          </div>
          <div class="rem">
            <el-button @click="removeYaoqing" type="success">清除本次邀请码</el-button>
          </div>
          <div class="res" v-if="yaoqingma != ''">
            邀请码已生成： <span style="color: red;">{{yaoqingma}}</span>
          </div>
          <div class="sub" v-if="yaoqingma != ''">
            <el-button @click="submitYaoqing()">上传邀请码</el-button>
          </div>
        </div>

        <table class="yq-list" border="1">
          <tr>
            <td>邀请码</td>
            <td>剩余使用次数</td>
            <td>操作</td>
          </tr>
          <tr v-for="yaoqing in yaoqings" class="yq-ul" >
            <td><span class="yq-u">{{yaoqing.yaoqing}}</span></td>
            <td><span class="yq-n">{{yaoqing.useNum}}</span></td>
            <td><a @click="removeList(yaoqing)">删除<i class="el-icon-delete2"></i></a></td>
          </tr>
        </table>
      </div>

      <div class="user">
        <div class="user-list">
          <el-transfer
            filterable
            :titles="['正常用户', '黑名单']"
            :filter-method="filterMethod"
            filter-placeholder="请输入用户名"
            @change="blackTo"
            v-model="value"
            :data="data">
          </el-transfer>
        </div>
      </div>
    </div>
  </lay-out>
</template>
<script>
  import layOut from '../Layout.vue'
  export default {
    data(){
      return {
        user: {
          username: '',
          userId: '',
          rooter: '',
        },
        yaoqings: [],
        yaoqingma: '',
        users: [],
        data: [],
        value: [],
        filterMethod(query, item) {
          return item.yonghu.indexOf(query) > -1;
        },
      };
    },
    mounted: function () {
      const storage = JSON.parse(window.sessionStorage.getItem('user'))
      if(storage){
        this.user = storage
        if(this.user.rooter == 'admin'){
          const objData = { userId: this.user.userId }
          this.$http.post('/yaoqing/find', objData).then((res, req) => {
            if(res.body.status == 200){
              this.yaoqings = res.body.data.yaoqings
              this.users = res.body.data.users
              let nw = []
              res.body.data.users.forEach((user, index)=>{
                nw.push(user.username)
              })
              const white = _ => {
                const datas = []
                const users = [...nw]
                const yonghu = [...nw]
                users.forEach((user, index) => {
                  datas.push({
                    label: user,
                    key: index,
                    yonghu: yonghu[index]
                  });
                });
                return datas
              };
              this.data = white()

              const names = []
              res.body.data.users.forEach((user, index)=>{
                names.push(user.username)
              })
              let nb = []
              res.body.data.black.forEach((user, index)=>{
                if(names.indexOf(user.username) > -1){
                  nb.unshift(names.indexOf(user.username))
                }
              })
              this.value = [...nb]
            }else{
              this.errMsg('加载错误')
            }
          })
        }else{
          this.errMsg('您不是管理员，不能访问这里')
          this.$router.push({ path: '/home' })
        }
      }else{
        this.errMsg('您不是管理员，不能访问这里')
        this.$router.push({ path: '/home' })
      }

    },
    components: {
      layOut,
    },
    methods: {
      blackTo:function (targetKeys, direction, moveKeys) {
        if(direction == 'right'){
          if (moveKeys.length == 1){
            this.fengjinUser(this.users[moveKeys].username, this.user.userId)
          }else{
            moveKeys.forEach((val, index) => {
              this.fengjinUser(this.users[index].username, this.user.userId)
            })
          }
        }else{
          if (moveKeys.length == 1){
            this.jiefengUser(this.users[moveKeys].username, this.user.userId)
          }else{
            moveKeys.forEach((val, index) => {
              this.jiefengUser(this.users[index].username, this.user.userId)
            })
          }
        }
      },
      // 生成邀请码
      setYaoqing: function () {
        this.yaoqingma = Math.random().toString(16).slice(2,8).toLocaleUpperCase()
      },
      removeYaoqing: function () {
        this.yaoqingma = ''
      },
      // 提交邀请按
      submitYaoqing: function(){
        const date = new Date()
        const timer = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()
        const data = {
          yaoqing: this.yaoqingma,
          createdBy: this.user.userId,
          createdOn: timer,
        }
        this.$http.post('/yaoqing/create', data).then((res, req) => {
           if(res.body.status == 200){
             this.yaoqings = res.body.data
             this.succMsg('邀请码已成功提交')
             this.yaoqingma = ''
           }else{
             this.errMsg(res.body.data)
           }
        })
      },
      //  删除列表邀请码
      removeList: function (yaoqing) {
        const data = {
          userId: this.user.userId,
          yaoqing: yaoqing.yaoqing,
        }
        this.$http.post('/yaoqing/remove', data).then((res, req) => {
          if(res.body.status == 200){
            this.succMsg('又干掉一个邀请码')
            this.yaoqings = res.body.data
          }else{
            this.errMsg(res.body.msg)
          }
        })
      },
      // 封禁用户
      fengjinUser: function (username, userId) {
        const data = {
          fengjin: username,
          userId: userId,
        }
        this.$http.post('/manager/fengjin', data).then((res, req) => {
          if(res.body.status == 200){
            this.succMsg('老老实实在小黑屋待着吧')
          }else{
            this.errMsg(res.body.msg)
          }
        })
      },
      // 解封用户
      jiefengUser: function (username, userId) {
        const data = {
          jiefeng: username,
          userId: userId,
        }
        this.$http.post('/manager/jiefeng', data).then((res, req) => {
          if(res.body.status == 200){
            this.succMsg('大赦博客')
          }else{
            this.errMsg(res.body.msg)
          }
        })
      },


    },
  }
</script>
<style lang="less">
  .manager{
    position: relative;
    width: 100%;
    height: 100%;
    .yaoqing{
      position: relative;
      width: 20%;
      margin: 3% 3% 3% 6%;
      float: left;
      .yaoqing-field{
        position: relative;
        top: 15%;
        width: 100%;
        height: 240px;
        min-width: 185px;
        border-radius: 5px;
        border: 2px solid olivedrab;
        padding: 2% 0;
        background-color: #FAFEF8;
        .res, .rem, .sub, .ran{
          margin-top: 5%;
          position: relative;
          top: 5%;
          left: 0%;
        }
      }

      .yq-list{
        position: relative;
        margin-top: 8%;
        width: 100%;
        font-size: 15px;
        text-align: center;
        min-width: 185px;
        float: left;
        background-color: #FAFEF8;
        .yq-ul{
          td{
            width: 5%;
            a{
              text-decoration: none;
              cursor: pointer;
              color: cadetblue;
            }
            .yq-u, .yq-n, .yq-t{
              color: red;
            }
          }
        }
      }

    }

    .user{
      position: relative;
      float: left;
      margin: 3%;
      height: 100%;
      .user-list {
        position: relative;
        .el-transfer-panel__item{
          .el-checkbox__input {
            .el-checkbox__inner {
              left: -80px;
            }
          }
        }
        .user-ul{
          a{
            text-decoration: none;
            cursor: pointer;
            color: red;
          }
        }
      }
    }

  }
</style>
