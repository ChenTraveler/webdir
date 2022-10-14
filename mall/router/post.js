const express = require('express')
const postRouter = express.Router()
const mysql = require('../db/db')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcryptjs')

postRouter.use(express.urlencoded({ extended: false }))
postRouter.use(cookieParser())

// 定义操作数据函数
let setdb = (db, sql, parameter = null, callback) => {
  db.query(sql, parameter, (err, d) => {
    if (err) throw err
    callback && callback(d)
  })
}

// 注册
postRouter.post('/rej', (req, res) => {
  let { phone, uname, pwd } = req.body
  // 创建加密等级
  const salt = bcrypt.genSaltSync(10)
  // 密码加密
  const _pwd = bcrypt.hashSync(pwd, salt)

  const sqltel = `select * from users where phone="${phone}"`
  const sqlsel = `select * from users where username="${uname}"`
  const sqladd = `insert into users (phone,username,password,rejTime) values ("${phone}","${uname}","${_pwd}",now())`
  // 操作数据库
  mysql((err, db) => {
    if (err) throw err
    setdb(db, sqltel, null, d => {
      if (d[0]) {
        res.send('手机号已注册')
      } else {
        setdb(db, sqlsel, null, d => {
          if (d[0]) {
            res.send('用户名不可用')
          } else {
            setdb(db, sqladd, null, d => {
              d.affectedRows == 1 ? res.send('注册成功') : res.send('因网络问题，注册失败，请重新注册')
            })
          }
        })
      }
    })
  })
})

// 登录
postRouter.post('/login', (req, res) => {
  let { phone, uname, pwd } = req.body

  const sqlsel = `select * from users where phone="${phone}" or phone="${uname}" or username="${uname}" and flag="t"`
  const sqlupd = `update users set loginTime=now() where phone="${phone}" or phone="${uname}" or username="${uname}"`

  // 操作数据库
  mysql((err, db) => {
    if (err) throw err
    setdb(db, sqlsel, null, d => {
      if (d[0]) {
        if (req.cookies.islogin != d[0].username) {
          if (phone) {
            setdb(db, sqlupd, null)
            res.cookie('islogin', d[0].username, { domain: 'localhost', maxAge: 60000 * 60 * 24 })
            // sessionStorage.setItem('loginname', d[0].username)
            res.send(`登入成功，尊敬的${d[0].username}，欢迎访问!`)
          } else {
            if (bcrypt.compareSync(pwd, d[0].password)) {
              setdb(db, sqlupd, null)
              res.cookie('islogin', d[0].username, { domain: 'localhost', maxAge: 60000 * 60 * 24 })
              // sessionStorage.setItem('loginname', d[0].username)
              res.send(`登入成功，尊敬的${d[0].username}，欢迎访问!`)
            } else {
              res.send('密码错误，请重新输入')
            }
          }
        } else {
          res.send('该用户已登录')
        }
      } else {
        res.send('用户未注册，请注册后登录')
      }
    })
  })
})

// 更新关注
postRouter.post('/follow', (req, res) => {
  let { flag } = req.body

  const sql_updf = `update shop set isfollow="${flag}" where title="神舟电脑旗舰店"`
  mysql((err, db) => {
    if (err) throw err
    setdb(db, sql_updf, null, d => {
      d.affectedRows == 1 ? res.send('更改成功') : res.send('更改失败')
    })
  })
})

// 获取首页商品数据
postRouter.post('/index', (req, res) => {
  const sql_data = `select * from goods where page like 'index'`
  mysql((err, db) => {
    if (err) throw err
    setdb(db, sql_data, null, d => {
      d ? res.send({ goods: d }) : res.send('获取失败')
    })
  })
})

// 获取宝贝页商品数据
postRouter.post('/baby', (req, res) => {
  const { sql } = req.body
  mysql((err, db) => {
    if (err) throw err
    setdb(db, sql, null, d => {
      d ? res.send({ goods: d }) : res.send('获取失败')
    })
  })
})

// 加入购物车
const sql_selcart = `select * from cart where username=? and options=? and goodsid=? and isjs="f"`
const sql_updcart = `update cart set num=? where id=?`
const sql_istcart = `insert into cart (username,shoptitle,title,src,options,price,num,coupon,stock,goodsid) values (?,?,?,?,?,?,?,?,?,?)`

postRouter.post('/details', (req, res) => {
  const { uname, shoptitle, title, src, option, price, num, coupon, stock, id } = req.body
  // console.log(uname, shoptitle, title, src, option, price, num, coupon, stock, id)
  mysql((err, db) => {
    if (err) throw err
    setdb(db, sql_selcart, [uname, option, id], d => {
      if (d[0]) {
        setdb(db, sql_updcart, [num * 1 + d[0].num * 1, d[0].id], d => {
          d.affectedRows == 1 ? res.send(true) : res.send(false)
        })
      } else {
        setdb(db, sql_istcart, [uname, shoptitle, title, src, option, price, num, coupon, stock, id], d => {
          d.affectedRows == 1 ? res.send(true) : res.send(false)
        })
      }
    })
  })
})

// 更新购物车数据
postRouter.post('/cart', (req, res) => {
  const { sql } = req.body
  mysql((err, db) => {
    if (err) throw err
    setdb(db, sql, null, d => {
      d.affectedRows == 1 || d[0] ? res.send(d) : res.send(false)
    })
  })
})

module.exports = postRouter
