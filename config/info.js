/**
 * created By caidong on 2018/2/23
 */
let info = {
  author: {
    email: 'itagn@foxmail.com',
    github: 'https://github.com/itagn',
    blog: 'http://itagn.xyz',
    tieba: 'https://tieba.baidu.com/f?kw=东东么么哒',
    sina: 'https://weibo.com/3782707172/profile?',
  },
  admin: {
    username: 'admin',
    password: 'dongdongmemedai',
    email: 'itagn@foxmail.com'
  },
  serverAddress: {
    url: 'http://localhost:8888',
    host: 'localhost',
    port: '8888'
  },
  userBlack: {
    all: ['游客', 'admin', '东东么么哒', '蔡东'],      //  用户不能全名词汇的注册
    regexp: ['傻逼'],             //  用户不能含有部分词汇的注册
  },
  emailInfo: {
    host: 'smtp.dongdongmemeda.com',
    user: 'admin@dongdongmemeda.com',
    pass: 'xxxxxxxx'
  },
  redis: {
    host: 'localhost',
    port: 6379,
    db: 7
  }
}

module.exports = info;
