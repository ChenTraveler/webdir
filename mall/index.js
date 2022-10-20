const express = require('express')
const app = express()
const postRouter = require('./router/post')
const getRouter = require('./router/get')
const ejs = require('ejs')
// 解析 token 的中间件
var { expressjwt: jwt } = require('express-jwt')
const port = 8888

// 配置静态资源
app.use(express.static('static'))
app.use(express.static('views'))
app.use(express.static('node_modules'))

// 设置默认使用的模板引擎
app.set('view engine', 'ejs')
app.set('views', './views')

// 使用中间件jwt
app.use(
  jwt({
    secret: 'chenmy', // 生成 token 时的钥匙，必须和生成 token 时设置的统一
    algorithms: ['HS256'] // 必填，加密算法，无需了解
  }).unless({
    path: [{ url: /^\/*/, methods: ['GET'] }, '/login', '/rej'] // 除了这些接口，其他都需要认证
  })
)

// 使用路由
app.use('/', postRouter)
app.use('/', getRouter)

// 验证错误处理
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    // res.status(401).send('invalid token...');
    res.status(401).send({ status: 1, message: '身份认证失败' })
  } else {
    console.log(req.auth)
    res.send({ message: '获取用户信息成功！', data: req.auth })
  }
})

app.listen(port, () => console.log(`Exapple app listening on port ${port}`))
