const express = require('express')
const path = require('path')
const db = require('../db/db')
const cookieParser = require('cookie-parser')
const getRouter = express.Router()
const mysql = require('../db/db')
const jwt_decode = require('jwt-decode')

getRouter.use(cookieParser())

// 定义操作数据函数
let setdb = (db, sql, parameter = null, callback) => {
  db.query(sql, parameter, (err, d) => {
    if (err) throw err
    callback && callback(d)
  })
}

// 获取轮播数据
const sql_swp = 'select src,route from swiper where sid=? and page like ? and flag="t"'
// 获取首页头部数据
const sql_header = 'select * from shop'
// 获取页面图片详情数据
const sql_introduce = 'select * from introduceimg where page like ?'
// 获取榜单数据
const sql_rxlist = 'select * from goods order by monthsales desc limit 3'
const sql_sclist = 'select * from goods order by collections desc limit 3'
const sql_xplist = 'select * from goods where isnew="t" order by recommend desc limit 3'

// 配置首页
getRouter.get('/index', (req, res) => {
  // 定义数据容器
  let data = {}
  mysql((err, db) => {
    if (err) throw err
    // 获取首页轮播图1
    setdb(db, sql_swp, ['1', '%index%'], d => {
      data.swiper1 = d
      // 获取首页轮播图2
      setdb(db, sql_swp, ['2', '%index%'], d => {
        data.swiper2 = d
        // 获取头部页面数据
        setdb(db, sql_header, null, d => {
          data.header = d
          // 获取首页详情数据
          setdb(db, sql_introduce, '%index%', d => {
            data.introduce = d
            // 获取榜单单数据
            data.list = {}
            // 热销
            setdb(db, sql_rxlist, '%index%', d => {
              data.list.rxlist = d
              // 收藏
              setdb(db, sql_sclist, '%index%', d => {
                data.list.sclist = d
                // 新品
                setdb(db, sql_xplist, '%index%', d => {
                  data.list.xplist = d
                  res.render('index', data)
                })
              })
            })
          })
        })
      })
    })
  })
})

// 配置分页
getRouter.get('/baby', (req, res) => {
  // 定义数据容器
  let data = {}
  mysql((err, db) => {
    if (err) throw err
    setdb(db, sql_header, null, d => {
      data.header = d
      res.render('baby', data)
    })
  })
})

// 配置商品详情页
const sql_goods = 'select * from goods where page like ? and flag="t"'
const sql_derails = 'select * from details where id=?'
const sql_coupon = 'select * from coupon where goodsid like ? order by num desc'
const sql_uptcart = 'update cart set isjs="f" where isjs="t" and orderStatus="待结算"'
// 获取商品数据
mysql((err, db) => {
  if (err) throw err
  setdb(db, sql_goods, '%index%', d => {
    d.forEach((i, index) => {
      // 根据跳转路由设置路由
      getRouter.get(i.route, (req, res) => {
        // 定义数据容器
        let data = {}
        data.data = d[index]
        // 根据id获取更多详情
        setdb(db, sql_derails, data.data.id, d => {
          data.details = d[0]
          // 获取底部图片
          setdb(db, sql_introduce, '%g' + data.data.id + 's%', d => {
            data.introduce = d
            // 获取优惠券
            setdb(db, sql_coupon, '%g' + data.data.id + 's%', d => {
              data.coupon = d
              // 获取轮播图
              setdb(db, sql_swp, ['1', '%g' + data.data.id + 's%'], d => {
                data.swiper = d
                setdb(db, sql_uptcart, null, d => {})
                res.render('details', data)
              })
            })
          })
        })
      })
    })
  })
})

let uname = null
getRouter.get('/token', (req, res) => {
  const { token } = req.query
  uname = jwt_decode(token).uname
  res.send(true)
})

const sql_cart = 'select * from cart where username=? and isjs="f" order by shoptitle'
// 配置购物车页面
getRouter.get(`/cart`, (req, res) => {
  // 定义数据容器
  let data = {}
  mysql((err, db) => {
    if (err) throw err
    setdb(db, sql_uptcart, null, d => {
      // 获取数据
      //req.cookies.islogin
      console.log(uname)
      setdb(db, sql_cart, uname, d => {
        data.data = d
        res.render('cart', data)
      })
    })
  })
})

// 配置订单页
const sql_order = `select * from cart where isjs="t" and orderflag="t" and username=? order by resTime desc`
getRouter.get(`/order`, (req, res) => {
  // 定义数据容器
  let data = {}
  mysql((err, db) => {
    if (err) throw err
    setdb(db, sql_uptcart, null, d => {
      // 获取数据
      setdb(db, sql_order, localStorage.getItem('token'), d => {
        data.data = d
        res.render('order', data)
      })
    })
  })
})

// 配置结算页
getRouter.get(`/settlement`, (req, res) => {
  // 定义数据容器
  let data = {}
  res.render('settlement', data)
})

// 配置登录页面
getRouter.get('/login', (req, res) => {
  res.render('login')
})

// 配置注册页面
getRouter.get('/rej', (req, res) => {
  res.render('rej')
})

module.exports = getRouter
