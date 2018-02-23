/**
 *  Create by caidong on 2017/9
 */

const multer = require('koa-multer')
const userController = require('../controller/userController')

module.exports = function (koaRouter, options) {
  // 创建Controller实例
  const user = new userController(options)
  //头像上传
  const imgURL = 'src/user/faceU/'
  const storage = multer.diskStorage({
    // 头像保存的目录
    destination: function (req, file, cb) {
      cb(null, imgURL)
    },
    // 修改文件名称
    filename: function (req, file, cb) {
      const fileArr = file.originalname.split('.')
      const fileType = fileArr[fileArr.length-1]
      const fileName = Date.now().toString() + '.' + fileType
      cb(null, fileName)
    }
  })
  // 加载上传配置
  const upload = multer({storage: storage})
  // get请求

  // post请求
  koaRouter.post('/user/faceU', upload.single('file'), user.faceU)
  koaRouter.post('/user/find', user.getUser)
  koaRouter.post('/user/addFans/', user.addFans)
  koaRouter.post('/user/subFans/', user.subFans)
}
