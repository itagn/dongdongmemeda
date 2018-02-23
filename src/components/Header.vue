<template>
  <div class="header">
    <div class="header-content">
      <el-row class="tac">
        <el-col :span="25">
          <el-menu :default-active="activeIndex" mode="horizontal"
                   @select="handleSelect" class="el">
            <el-menu-item index="1" @click="goHome">
              <i class="el-icon-menu"></i>博客大堂
            </el-menu-item>
            <el-menu-item index="2"><i class="el-icon-document"></i>装逼大会</el-menu-item>
          <el-menu-item index="3">
            <el-input v-model="input"
                      placeholder="博文标题or内容or作者"
                      icon="search"
                      @keyup.enter.native="enterSearch"
                      @click="searchBlog">
            </el-input>
          </el-menu-item>
          <el-submenu index="4">
            <template slot="title" :data-uid="user.userId">{{user.username}}</template>
            <el-menu-item index="4-1" v-if="isShow">
              <el-badge :value="msgNum" :max="99" class="item">回复</el-badge>
            </el-menu-item>
            <el-menu-item @click="userQuit" index="4-2">退出</el-menu-item>
          </el-submenu>
          </el-menu>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import ElCol from "element-ui/packages/col/src/col";
  export default {
    data(){
      return {
        input: '',
        activeIndex: '1',
        msgNum: '20',
        user: {
          username: '',
          userId: '',
        },
        isShow: false,
      }
    },
    mounted: function () {
      const storage = JSON.parse(window.sessionStorage.getItem('user'))
      if(storage){
        this.isShow = true
        this.user = storage
      }else{
        this.user = {
          username: '游客',
          userId: 'other',
        }
      }
    },
    components: {
      ElCol,
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
      enterSearch: function () {
        this.searchBlog()
      },
      searchBlog: function () {
          const data = {
            search: this.input.trim()
          }
          this.$http.post('/blog/search', data).then((res, req) => {
            if(res.body.status == 200){
              this.$emit('searchBlog', res.body.data)
            }else{
              this.errMsg(res.body.msg)
            }
          })
      },
      // 回到主页
      goHome: function () {
        this.$router.push({ path: '/home' })
      },
      handleSelect(key, keyPath) {
        console.log(key, keyPath)
      },
      // 用户登出
      userQuit: function () {
        if(this.user.userId!='other'){
          this.$store.commit('delectUser') // 清处vuex的用户信息
          window.sessionStorage.removeItem('user')
        }
        this.succMsg('下次再来玩啊')
        this.$router.push({ path: '/logout' })
      }
    }
  }
</script>
<style lang="less">
  .header{
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
    color: #fff;
    font-family: 'Helvetica Neue',Helvetica,'PingFang SC','Hiragino Sans GB','Microsoft YaHei',Arial,sans-serif;
    .header-content{
      width: 100%;
      height: 100%;
      margin: 0 auto;
      font-size: 18px;
    }
  }
</style>
