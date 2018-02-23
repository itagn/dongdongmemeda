/**
 *  Create by caidong on 2017/9
 */

const info = require('../../config/info');
const caidong = {
  desc(){
    // console.clear()
    const author = `%c    ----------------------------------------------------
    |    作者：蔡东
    |    毕业院校：电子科技大学
    |    贴吧ID：东东么么哒
    |    邮箱：${info.author.email}
    |    Github：${info.author.github}
    ----------------------------------------------------
    `
    console.log(author, 'color: #2E7FDB;')
  }
}

module.exports = caidong
