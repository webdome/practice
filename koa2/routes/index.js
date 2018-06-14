const router = require('koa-router')()

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

const multer = require('koa-multer')
var storage = multer.diskStorage({
  //文件保存路径  
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  //修改文件名称  
  filename: function (req, file, cb) {
    var fileFormat = (file.originalname).split(".");
    cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
})
//加载配置  
var upload = multer({
  storage: storage
});
router.post('/upload', upload.single('file'), async (ctx, next) => {
  ctx.body = {
    file: ctx.req.file.filename
  }
})
module.exports = router
