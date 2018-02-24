/**
 * created By caidong on 2018/2/23
 */
let info = {
  clientAddress: {
    host: 'localhost',
    port: 7777
  },
  serverAddress: {
    url: 'http://localhost:8888',
    host: 'localhost',
    port: 8888
  },
  redis: {
    host: 'localhost',
    port: 6379,
    db: 7
  },
  mongodb: {
    url: 'mongodb://localhost:27017/dongdongmemeda',
    host: 'localhost',
    port: 27017,
    db: 'dongdongmemeda'
  },
  email: {
    host: 'smtp.dongdongmemeda.com',
    port: 25,
    user: 'admin@dongdongmemeda.com',
    pass: 'xxxxxxxx'
  },
  admin: {
    username: 'admin',
    password: 'dongdongmemedai',
    email: 'itagn@foxmail.com'
  },
  author: {
    github: 'https://github.com/itagn',
    blog: 'http://itagn.xyz',
    tieba: 'https://tieba.baidu.com/f?kw=东东么么哒',
    sina: 'https://weibo.com/3782707172/profile?',
  },
  userBlack: {
    all: ['游客', 'admin', '东东么么哒', '蔡东'],      //  用户不能全名词汇的注册
    regexp: ['傻逼'],             //  用户不能含有部分词汇的注册
  }
}

module.exports = info;
