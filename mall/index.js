const express = require('express')
const app = express()
const postRouter = require('./router/post')
const getRouter = require('./router/get')
const ejs = require('ejs')
const port = 8888

// 配置静态资源
app.use(express.static('static'))
app.use(express.static('views'))
app.use(express.static('node_modules'))

// 设置默认使用的模板引擎
app.set('view engine', 'ejs')
app.set('views', './views')

// 使用路由
app.use('/', postRouter)
app.use('/', getRouter)

app.listen(port, () => console.log(`Exapple app listening on port ${port}`))
