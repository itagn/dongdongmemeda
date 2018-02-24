<template>
  <fl-oat>
    <div slot="floatContent" class="blog">

      <div class="mask" v-if="article.isQrcode"></div>
      <div class="blog-qrcode" v-if="article.isQrcode" >
        <div class="qrcode-title">分享到朋友圈</div>
        <img :src="article.qrcode" class="qrcode-img" />
        <a class="qrcode-close" @click="closeQrcode"><i class="el-icon-circle-cross"></i></a>
      </div>

      <a href="#top" class="up"><i class="el-icon-arrow-up"></i></a>

      <a name="#top"></a>
      <div class="author">
        <div class="author-img">
          <img :src="author.userImgURL" @click="watchHome(author.userId)"/>
        </div>
        <div class="author-info">
          <div class="author-name">博主 <span>{{author.username}}</span></div>
          <div class="author-bk">博文数量 <span>{{author.boke.length}}</span></div>
          <div class="author-star">关注 <span>{{author.starLen}}</span></div>
          <div class="author-fans">粉丝 <span>{{author.fansLen}}</span></div>
        </div>
        <div class="author-fan">
          <el-button type="primary" @click="fanStar" v-if="blog.createdBy!=user.userId&&'other'!=user.userId">{{fanBu}}</el-button>
        </div>
      </div>

      <div class="article">
        <div class="article-title">{{blog.title}}</div>
        <div class="article-field">
          博主（{{blog.author}}）&nbsp;&nbsp;&nbsp;访问 {{blog.readNum}} 次&nbsp;&nbsp;&nbsp;评论 {{blog.commentNum}} 次
        </div>
        <el-button class="article-delete" v-if="user.rooter=='admin'||user.userId==blog.createdBy" type="text" @click="removeBlog">
          <i class="el-icon-delete2"></i>删除博文
        </el-button>
        <div class="article-body">
          <pre class="pre">{{blog.body}}</pre>
        </div>

        <div class="share">
          <ul>
            <li><span>分享到</span></li>
            <li><a @click="shareWechat" title="分享到朋友圈"><img src="../../assets/wechat.png" />朋友圈</a></li>
            <li><a @click="shareSina" title="分享到新浪微博"><img src="../../assets/weibo.png" />新浪微博</a></li>
            <li><a @click="shareQzone" title="分享到QQ空间"><img src="../../assets/qzone.png" />QQ空间</a></li>
            <li><a @click="shareDouban" title="分享到豆瓣"><img src="../../assets/douban.png" />豆瓣</a></li>
            <li><a @click="shareRenRen" title="分享到人人网"><img src="../../assets/renren.png" />人人网</a></li>
          </ul>
        </div>

        <el-input type="textarea" v-model="article.textarea" :rows="8" placeholder="  快来评论吧..." class="blog-textarea"></el-input>
        <el-button type="primary" @click="submitComment" class="blog-commit">发表</el-button>

        <div class="comment-ul" v-if="comments.length">
          <div class="comment-li" v-for="comment in comments">
            <div class="comment-user">
              <div class="comment-img">
                <img :src="comment.userImgURL" @click="watchHome(comment.createdBy)" class="comment-img"/>
                <span class="comment-author">{{comment.author}}<span v-if="comment.createdBy==blog.createdBy">(博主)</span></span>
                <span class="comment-floor"># {{comment.index}} 楼</span>
                <span class="comment-option"><img src="../../assets/upzan.png" @click="upZan(comment._id, comment.up, comment.index)" />&nbsp;{{comment.up}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<img src="../../assets/downzan.png" @click="downZan(comment._id, comment.down, comment.index)" />&nbsp;{{comment.down}}</span>
                <span class="comment-time">{{comment.createdOn}}</span>
              </div>
            </div>
            <hr class="comment-hr"/>
            <div class="comment-content">
              <div class="comment-body">
                <div class="comment-div">
                  <pre class="comment-comment">{{comment.body}}</pre>
                </div>
                <el-button type="text" class="comment-reply-button" @click="showComment(comment.index)">回复</el-button>
                <el-button type="text" v-if="user.rooter=='admin' || user.userId==comment.createdBy"
                           @click="showPop(comment.index)" class="comment-reply-remove">删除</el-button>

                <div v-if="see[comment.index - 1]" class="remove-box">
                  <p class="remove-title">确定删除评论吗？</p>
                  <div class="remove-body">
                    <el-button type="primary" size="mini"  @click="removeComment(comment._id)">确定</el-button>
                    <el-button size="mini" type="text" @click="hidePop(comment.index)">取消</el-button>
                  </div>
                </div>
              </div>

              <div class="comment-footer">
                <div v-if="comment.reply.length > 0" class="reply-ul">
                  <div class="reply-li" v-for="reply in comment.reply">
                    <div class="reply-header" >
                      <img :src="reply.userImgURL" class="reply-img"  @click="watchHome(reply.createdBy)"/>
                      <span class="reply-content">
                        <div class="reply-msg"><a class="reply-author">{{reply.author}}</a><span v-if="reply.createdBy==blog.createdBy">(博主)</span><span v-if="reply.createdTo">&nbsp;回复&nbsp;<a class="reply-other">{{reply.createdTo}}</a><span v-if="reply.createdTo==blog.author">(博主)</span></span>&nbsp;:&nbsp;<span>{{reply.body}}</span></div>
                      </span>
                    </div>
                    <div class="reply-footer">
                      <span class="reply-time">{{reply.createdOn}}</span>
                      <el-button type="text" class="reply-button" @click="showReply(comment.index, reply.author, reply.body)">回复</el-button>
                    </div>
                  </div>
                </div>

                <div v-if="tocomment[comment.index - 1]">
                  <el-input type="textarea" v-model="replyInput" class="reply-textarea" v-focus="true"></el-input>
                  <el-button type="primary" class="reply-submit" @click="replySubmit(comment._id, comment.index)">提交</el-button>
                </div>
                <div v-if="toreply[comment.index - 1]">
                  <el-input type="textarea" v-model="replyInput" class="reply-textarea" v-focus="true"></el-input>
                  <el-button type="primary" class="reply-submit" @click="replyTo(comment._id, comment.index, replyToUser.createdTo, replyToUser.prevMsg )">提交</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </fl-oat>
</template>
<script>
  import flOat from '../Float.vue'
  import ElButton from "../../../node_modules/element-ui/packages/button/src/button.vue";
  export default {
    data(){
      return {
        user: {
          username: '',
          userId: '',
          rooter: '',
          email: '',
        },
        blog: {
          blogId: '',
          createdBy: '',
          createdOn: '',
          title: '',
          body: '',
          readNum: '',
          field: '',
          secret: '',
          commentNum: '',
          author: '',
        },
        article: {
          textarea: '',
          isQrcode: false,
          qrcode: '',
        },
        replyInput: '',
        comments: [],
        author: {
          username: '',
          email: '',
          userImgUrl: '',
          userId: '',
          boke: '',
          starLen: 0,
          fansLen: 0,
        },
        fanBu: '',
        visible: [],
        see: [],
        isReply: [],
        tocomment: [],
        toreply: [],
        replyToUser: {
          prevMsg: '',
          createdTo: '',
        }
      }
    },
    mounted: function () {
      const storage = JSON.parse(window.sessionStorage.getItem('user'))
      if(storage){
        this.user = storage
      }else{
        this.user = {
          username: '游客',
          userId: 'other',
          rooter: 'other',
          email: 'other',
        }
      }
      const bid = this.$route.query.bid
      //  转发的网址
      this.url = window.location.href
      const data = {
        bid: bid,
        userId: this.user.userId,
      }
      this.$http.post('/blog/getInfo', data).then((res, req) => {
        if(res.body.status == 200){
          if(res.body.data){
            const resBlog = res.body.data
            let arr = [];
            for(let i in res.body.comment){
              let comment = res.body.comment[i];
              comment.index = res.body.comment.length - parseInt(i);
              arr.push(comment);
            }
            this.comments = arr;
            console.log(arr)
            for(let i=0;i<this.comments.length;i++){
              this.visible[i] = false;
            }
            this.see = [...this.visible];
            this.isReply = [...this.visible];
            this.tocomment = [...this.visible];
            this.toreply = [...this.visible];
            if(res.body.isFans){
              this.fanBu = '取消关注';
            }else{
              this.fanBu = '加个关注';
            }
            this.author = res.body.author;
            this.author.userId = res.body.data.createdBy;
            this.blog = resBlog;
            this.blog.blogId = bid;
          }
        }else if(res.body.status == 707){
          this.errMsg('这货疑似被人干掉了')
          this.$router.push({ path: '/home' })
        }else{
          this.errMsg(res.body.msg)
        }
      })
    },
    components: {
      ElButton,
      flOat,
    },
    directives: {
      focus: {
        inserted: function (el, {value}) {
          if (value) {
            el.getElementsByTagName('textarea')[0].focus()
          }
        }
      }
    },
    methods: {
      fanStar: function () {
        if(this.fanBu == '加个关注'){
          const data = {
            starId: this.author.userId,
            starName: this.author.username,
            fansId: this.user.userId,
            fansName: this.user.username,
          }
          this.$http.post('/user/addFans', data).then((res, req) => {
            if(res.body.status == 200){
              this.succMsg('我要做你的迷弟迷妹');
              this.fanBu = '取消关注';
              this.author.fansLen++;
            }else{
              this.errMsg(res.body.msg)
            }
          })
        }else if(this.fanBu == '取消关注'){
          const data = {
            starId: this.author.userId,
            starName: this.author.username,
            fansId: this.user.userId,
            fansName: this.user.username,
          }
          this.$http.post('/user/subFans', data).then((res, req) => {
            if(res.body.status == 200){
              this.succMsg('你让我有点失望');
              this.fanBu = '加个关注';
              this.author.fansLen--;
            }else{
              this.errMsg(res.body.msg);
            }
          })
        }
      },
      closeQrcode: function () {
        this.article.isQrcode = false
        this.article.qrcode = ''
      },
      //转发微信朋友圈
      shareWechat: function () {
        if(this.user.userId != 'other'){
          const data = {
            url: this.url,
          }
          this.$http.post('/blog/qrcode', data).then((res, req) => {
            if(res.body.status == 200){
              this.article.isQrcode = true
              this.article.qrcode = res.body.data
            }else{
              this.errMsg(res.body.msg)
            }
          })
        }else{
          this.errMsg('为什么不问我要邀请码呢')
        }
      },
      //转发新浪微博
      shareSina: function () {
        if(this.user.userId != 'other'){
          const sharesinastring = `http://service.weibo.com/share/share.php?&url=${this.url}&title=${this.blog.title}&pic=`
          window.open(sharesinastring, '_blank')
        }else{
          this.errMsg('为什么不问我要邀请码呢')
        }
      },
      //转发QQ空间
      shareQzone: function() {
        if(this.user.userId != 'other'){
          const shareqqzonestring = `https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=${this.url}&title=${this.blog.title}&desc=&summary=&site=&pics=`
          window.open(shareqqzonestring, '_blank')
        }else{
          this.errMsg('为什么不问我要邀请码呢')
        }
      },
      //转发豆瓣
      shareDouban: function() {
        if(this.user.userId != 'other'){
          const shareqqzonestring = `https://www.douban.com/recommend/?url=${this.url}&title=${this.blog.title}&desc=&summary=&site=&pics=`
          window.open(shareqqzonestring, '_blank')
        }else{
          this.errMsg('为什么不问我要邀请码呢')
        }
      },
      //转发人人网
      shareRenRen: function() {
        if(this.user.userId != 'other'){
          const sharerenrenstring = `http://widget.renren.com/dialog/share?resourceUrl=${this.url}&srcUrl=${this.url}&title=${this.blog.title}&description=`
          window.open(sharerenrenstring,'_blank')
        }else{
          this.errMsg('为什么不问我要邀请码呢')
        }
      },
      removeBlog: function () {
        this.$confirm('此操作将导致该博文全家阴曹地府一轮游, 是否忍心?', '报告', {
          confirmButtonText: '不爱了，分手吧',
          cancelButtonText: '是我手残了',
          lockScroll: false,
          type: 'warning'
        }).then(() => {
          const data = {
            blogId: this.blog.blogId,
          }
          this.$http.post('/blog/remove', data).then((res, req) => {
            if(res.body.status == 200){
              this.succMsg('拜拜就拜拜，下一个更乖')
              this.$router.push({ path: '/home' })
            }else{
              this.errMsg(res.body.msg)
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '你差点就失去我了'
          })
        })
      },
      watchHome: function (uid) {
        this.$router.push({ name: 'user', query: { uid: uid, } });
      },
      submitComment: function () {
        if(this.user.userId != 'other'){
          if(this.article.textarea.trim()){
            const date = new Date();
            const timer = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
            const data = {
              createdBy: this.user.userId,
              author: this.user.username,
              comment: this.article.textarea,
              createdOn: timer,
              blogId: this.blog.blogId,
            }
            this.$http.post('/comment/create', data).then((res, req) => {
              if(res.body.status == 200){
                this.article.textarea = '';
                this.blog.commentNum++;
                this.succMsg('你确定你的话说完了？');
                let comment = res.body.data;
                comment.index = this.comments.length+1;
                this.comments.unshift(comment);
              }else{
                this.errMsg(res.body.msg);
              }
            })
          }else{
            this.errMsg('我的字典里没有“空白”这个单词');
          }
        }else{
          this.errMsg('为什么不问我要邀请码呢');
        }
      },
      removeComment: function (id) {
        const data = {
          bid: this.blog.blogId,
          cid: id,
        }
        this.$http.post('/comment/remove', data).then((res, req) => {
          if(res.body.status == 200){
            this.succMsg('我的黑历史不能让别人知道');
            this.blog.commentNum--;
            this.comments = [];
            this.comments = res.body.data;
            this.visible = [];
            for(let i=0;i<this.comments.length;i++){
              this.visible.push(false);
            }
            this.see = [...this.visible];
            this.isReply = [...this.visible];
            this.tocomment = [...this.visible];
            this.toreply = [...this.visible];
          }else{
            this.errMsg(res.body.msg)
          }
        })
      },
      replyMsg: function (data) {
        this.$http.post('/dynamic/create', data).then((res, req) => {
          if(res.body.status == 200){
            this.succMsg('你的评论我有共鸣');
            this.comments = [];
            for(let i in res.body.data){
              let comment = res.body.data[i];
              comment.index = res.body.data.length - parseInt(i);
              this.comments.push(comment);
            }
          }else{
            this.errMsg(res.body.msg);
          }
        })
      },
      replySubmit: function (id, index) {
        const date = new Date()
        const timer = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
        const data = {
          blogId: this.blog.blogId,
          commentId: id,
          createdOn: timer,
          createdBy: this.user.userId,
          author: this.user.username,
          body: this.replyInput,
          prevMsg: '',
          createdTo: '',
        }
        this.replyInput = '';
        this.showComment(index);
        this.replyMsg(data);
      },
      replyTo: function (id, index, author, body) {
        const date = new Date()
        const timer = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        const data = {
          blogId: this.blog.blogId,
          commentId: id,
          timer: timer,
          createdBy: this.user.userId,
          author: this.user.username,
          body: this.replyInput,
          prevMsg: body,
          createdTo: author,
        }
        this.replyInput = '';
        this.showReply(index);
        this.replyMsg(data);
      },
      upZan: function (id, num, index) {
        const data = {
          cid: id,
          up: num + 1,
        }
        this.$http.post('/comment/up', data).then((res, req) => {
          if(res.body.status == 200){
            this.succMsg('你觉得这个评论可以打call');
            this.comments[this.comments.length - index].up++
          }else{
            this.errMsg(res.body.msg);
          }
        })
      },
      downZan: function (id, num, index) {
        const data = {
          cid: id,
          down: num + 1
        }
        this.$http.post('/comment/down', data).then((res, req) => {
          if(res.body.status == 200){
            this.succMsg('为什么会有这样的评论出现在博文里');
            this.comments[this.comments.length - index].down++;
          }else{
            this.errMsg(res.body.msg);
          }
        })
      },
      showPop: function(index){
        for(let i in this.visible){
          if(parseInt(i)-index+1 != 0){
            this.visible[i] = false
          }
        }
        this.visible[index-1] = !this.visible[index-1]
        this.see = [...this.visible]
      },
      hidePop: function (index) {
        this.visible[index-1] = false
        this.see = [...this.visible]
      },
      showComment: function (index) {
        for(let i in this.isReply){
          this.toreply[i] = false
          if(parseInt(i)-index+1 != 0){
            this.isReply[i] = false
          }
        }
        this.isReply[index-1] = !this.isReply[index-1]
        this.tocomment = [...this.isReply]
      },
      showReply: function (index, createdTo, prevMsg) {
        for(let i in this.isReply){
          this.tocomment[i] = false
          if(parseInt(i)-index+1 != 0){
            this.isReply[i] = false
          }
        }
        this.isReply[index-1] = !this.isReply[index-1]
        this.toreply = [...this.isReply]
        this.replyToUser = {
          createdTo: createdTo,
          prevMsg: prevMsg,
        }
      },

    }
  }
</script>
<style lang="less">
  @width: 60%;
  .blog{
    position: relative;
    width: 100%;
    min-height: 100%;

    .mask {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      background-color: black;
      opacity: 0.7;
      z-index: 10;
    }
    .blog-qrcode {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      width: 180px;
      height: 207px;
      background-color: #FFF;
      z-index: 20;
      opacity: 1;
      border: 1px solid #000;
      .qrcode-title {
        position: relative;
        margin-top: 10px;
        font-size: 20px;
      }
      .qrcode-img {
        position: relative;
      }
      .qrcode-close{
        position: absolute;
        top: 3px;
        right: 3px;
        cursor: pointer;
      }
    }

    .up{
      position: fixed;
      width: 40px;
      height: 40px;
      border-radius: 5px;
      border: 1px #00B7FF solid;
      background-color: #FEFAF7;
      right: 8%;
      bottom: 16%;
      i{
        position: relative;
        left: 3%;
        top: 30%;
      }
    }

    .author{
      position: fixed;
      top: 3%;
      right: 3%;
      margin-top: 50px;
      width:12%;
      border-radius: 10px;
      background-color: #FAEBD7;
      .author-img{
        position: relative;
        top: 20px;
        img{
          cursor: pointer;
          width: 64px;
          height: 64px;
          border-radius: 5px;
        }
      }
      .author-info{
        position: relative;
        top: 28px;
        text-align: left;
        .author-name, .author-bk, .author-star, .author-fans{
          position: relative;
          margin-left: 20px;
          min-height: 30px;
          span{
            color: #00B7FF;
            font-size: 14px;
          }
        }
        .author-name{
          width: 80%;
          word-wrap: break-word;
          white-space: pre-wrap;
        }
        .author-bk{
        }
        .author-star{
        }
        .author-fans{
        }
      }
      .author-fan{
        position: relative;
        margin: 40px 0 10px 0;
      }
    }

    .article{
      position: relative;
      margin: 10px 0 10px (100%-@width)/2;
      width: @width;
      padding: 30px 20px;
      background-color: #eee;
      border-radius: 7px;
      .article-title{
        font-size: 26px;
        color: #5d95ea;
      }
      .article-field{
        margin-top: 10px;
        font-size: 14px;
      }
      .article-delete{
        position: absolute;
        left: 30px;
        top: 64px;
      }
      .article-body{
        margin: 10px 0;
        font-size: 18px;
        border: 1px solid #ccc;
        padding: 2px 10px;
        .pre{
          text-align: left;
          font-family: 'Helvetica Neue',Helvetica,'PingFang SC','Hiragino Sans GB','Microsoft YaHei',Arial,sans-serif;
          color: olivedrab;
          width: 100%;
          word-wrap: break-word;
          white-space: pre-wrap;
        }
      }

      .share{
        position: relative;
        top: 0;
        width: 100%;
        ul{
          list-style: none;
          padding: 0;
          text-align: left;
          li{
            font-size: 18px;
            display: inline-block;
            margin-left: 6px;
            span{
              cursor: pointer;
              color: #2e68aa;
              font-weight: 800;
              transition: all 0.5s;
              &:hover{
                opacity: 0.8;
              }
            }
            a{
              color: #e08031;
              cursor: pointer;
              font-size: 18px;
              font-weight: 500;
              text-decoration: none;
              transition: all 0.5s;
              &:hover{
                text-decoration: underline;
              }
            }
          }
        }
      }

      .blog-textarea{
        position: relative;
        top: 0;
        width: 100%;
      }

      .blog-commit{
        position: relative;
        top: 10px;
        width: 100px;
      }

      .comment-ul{
        position: relative;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        margin-top: 20px;
        .comment-li{
          position: relative;
          top: 0;
          left: 0;
          width: 100%;
          border: 1px #bbb solid;
          background-color: #fff;
          margin-top: 10px;

          .comment-user{
            position: relative;
            top: 0;
            left: 0;
            width: 100%;
            height: 78px;
            .comment-img{
              position: relative;
              top: 7px;
              left: 7px;
              text-align: left;
              .comment-img{
                border-radius: 5px;
                cursor: pointer;
                width: 64px;
                height: 64px;
              }
            }
              span{
                position: absolute;
                line-height: 30px;
                font-size: 14px;
              }
              .comment-author{
                top: 36px;
                left: 80px;
                width: 240px;
                color: #5885b8;
              }
              .comment-floor{
                top: 36px;
                left: 44%;
                margin: 0 auto;
                color: #999;
              }
              .comment-option{
                top: 6px;
                right: 30px;
                img{
                  cursor: pointer;
                }
              }
              .comment-time{
                top: 36px;
                right: 20px;
                color: #999;
              }
          }
          .comment-hr{
            height: 1px;
            width: 100%;
            background-color: olivedrab;
            margin: 0 0 10px 0;
          }
          .comment-content{
            position: relative;
            top: 0;
            left: 0;
            width: 100%;
            .comment-body{
              position: relative;
              left: 0;
              top: 0;
              width: 100%;
              .comment-div{
                position: relative;
                top: 0;
                right: 0;
                width: 90%;
                margin: 0 5% 30px 5%;
                .comment-comment{
                  position: relative;
                  left: 0;
                  width: 100%;
                  text-align: left;
                  margin: 0;
                  font-size: 14px;
                  font-family: 'Helvetica Neue',Helvetica,'PingFang SC','Hiragino Sans GB','Microsoft YaHei',Arial,sans-serif;
                  word-wrap: break-word;
                  white-space: pre-wrap;
                }
              }
              .comment-reply-button{
                position: absolute;
                right: 45px;
                top: 99%;
              }
              .comment-reply-remove{
                position: absolute;
                right: 7px;
                top: 99%;
              }
              .remove-box{
                position: absolute;
                width: 160px;
                top: -100%;
                left: 101%;
                border: 1px solid #00B7FF;
                background-color: #fff;
                border-radius: 10px;
                .remove-title{
                  font-size: 14px;
                  margin: 10px;
                }
                .remove-body{
                  margin: 10px 0;
                }
              }
            }
            .comment-footer{
              background-color: #F7F8FA;
              margin-left: 10%;
              width: 90%;
              .reply-ul{
                position: relative;
                top: 0;
                left: 0;
                height: 100%;
                width: 100%;
                .reply-li{
                  position: relative;
                  top: 1px;
                  left:0;
                  width: 100%;
                  padding: 0 0 10px 0;
                  border-bottom: 1px dashed #999;
                  .reply-header{
                    position: relative;
                    top: 0;
                    left: 0;
                    width: 100%;
                    min-height: 50px;
                    text-align: left;
                    .reply-img{
                      position: absolute;
                      top: 10px;
                      left: 1%;
                      width: 6%;
                      cursor: pointer;
                      border-radius: 5px;
                    }
                    .reply-content{
                      position: relative;
                      top: 10px;
                      word-wrap: break-word;
                      white-space: pre-wrap;
                      .reply-msg{
                        position: relative;
                        width: 90%;
                        margin-left: 8%;
                        font-size: 14px;
                        .reply-author, .reply-other{
                          cursor: pointer;
                          text-decoration: none;
                          color: #00B7FF;
                        }
                      }
                    }
                  }
                  .reply-footer{
                    position: relative;
                    text-align: right;
                    bottom: 0;
                    height: 20px;
                    .reply-time{
                      font-size: 14px;
                      margin-right: 10px;
                    }
                    .reply-button{
                      font-size: 14px;
                      margin-right: 20px;
                    }
                  }
                }
              }
              .reply-textarea{
                margin-top: 1%;
                width: 96%;
              }
              .reply-submit{
                position: relative;
                left: 43%;
                margin: 5px 0;
              }
            }

          }

        }
      }

    }



  }
</style>
