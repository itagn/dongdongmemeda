<template>
  <div class="footer">
    <div class="footer-content">
      <span class="ic">{{msg}}<sup>(c)</sup></span>
      <span class="url">
        <span class="friendTitle">
          友情链接：
          <a class="github" :href="github" target="_blank" :title="github">Github</a>
          <a class="tieba" :href="blog" target="_blank" :title="blog">博客</a>
          <a class="tieba" :href="tieba" target="_blank" :title="tieba">百度贴吧</a>
          <a class="sina" :href="sina" target="_blank" :title="sina">新浪微博</a>
        </span>
      </span>
    </div>
  </div>
</template>
<script>
  import info from '../../config/info';
  export default {
    data(){
      return {
        msg: '东东么么哒',
        github: info.author.github,
        blog: info.author.blog,
        tieba: info.author.tieba,
        sina: info.author.sina
      }
    }
  }
</script>
<style lang="less">
  .footer{
    font-family: 'Helvetica Neue',Helvetica,'PingFang SC','Hiragino Sans GB','Microsoft YaHei',Arial,sans-serif;
    position: relative;
    top: 60px;
    left: 0;
    width: 100%;
    height: 60px;
    background-color: #000;
    color: #fff;
    .footer-content{
      width: 100%;
      height: 100%;
      .ic{
        font-size: 18px;
        float: right;
        margin-right: 30px;
        line-height: 60px;
      }
      .url{
        font-size: 15px;
        height: 100%;
        .friendTitle{
          float: left;
          line-height: 60px;
          margin-left: 20px;
          a{
            color: #fff;
            text-decoration: none;
            display: inline-block;
            cursor: pointer;
            &:hover{
              text-decoration: underline;
            }
          }
          .github, .tieba, .sina, .weixin{
            margin-left: 10px;
          }
        }

      }
    }

  }
</style>
