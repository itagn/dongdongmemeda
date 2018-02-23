<template>
  <div class="container">
    <header-component @searchBlog="searchBlog"/>
    <div class="content">
      <slot name="content"></slot>
    </div>
    <footer-component />
  </div>
</template>
<script>
  import headerComponent from './Header.vue'
  import footerComponent from './Footer.vue'
  export default {
    data(){
      return {
        author: 'caidong',
      }
    },
    mounted: function () {
    },
    methods: {
      searchBlog: function (data) {
        this.$emit('message', data)
      },
    },
    components: {
      headerComponent,
      footerComponent,
    }
  }
</script>
<style lang="less">
  .container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    .content {
      position: relative;
      top: 60px;
      left: 0;
      width: 100%;
      height: 100%;
      font-family: 'Helvetica Neue',Helvetica,'PingFang SC','Hiragino Sans GB','Microsoft YaHei',Arial,sans-serif;
      display: flex;
      background-size: 100% 100%;
    }
  }
</style>
