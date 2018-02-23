<template>
  <fl-oat>
    <div slot="floatContent" class="home">
      {{other.username}}的空间
    </div>
  </fl-oat>
</template>
<script>
  import flOat from '../Float.vue'
  import caidong from '../../common/caidong.js'
  export default {
    data(){
      return {
        user: {},
        other: {},
      }
    },
    beforeCreate: function () {
//      caidong.desc()
    },
    mounted: function () {
      const storage = JSON.parse(window.sessionStorage.getItem('user'))
      if(storage){
        this.user = storage
        const uid = this.$route.query.uid
        const data = {
          userId: uid,
        }
        this.$http.post('/user/find', data).then((res, req) => {
          if(res.body.status == 200){
            this.other = res.body.data
          }else{
            this.errMsg(res.body.msg)
          }
        })
      }else{
        this.errMsg('游客你是不是走错路了？')
        window.history.go(-1)
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
    },
  }
</script>
<style lang="less">
  .home{
    width: 100%;
    min-height: 100%;
  }
</style>
