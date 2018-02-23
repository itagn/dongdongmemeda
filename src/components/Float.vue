<template>
  <div class="floatContainer">
    <header-component />
    <div class="floatContent">
      <slot name="floatContent"></slot>
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
    components: {
      headerComponent,
      footerComponent,
    }
  }
</script>
<style lang="less">
  .floatContainer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    .floatContent {
      position: relative;
      top: 60px;
      left: 0;
      width: 100%;
      min-height: 100%;
      font-family: 'Helvetica Neue',Helvetica,'PingFang SC','Hiragino Sans GB','Microsoft YaHei',Arial,sans-serif;
      display: flex;
      background-size: 100%;
    }
  }
</style>
