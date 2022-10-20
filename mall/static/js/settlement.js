const submit = document.querySelector('.bottom .btn')
const tc = document.querySelector('.alertbox')
const rej_btn = tc.querySelector('.rej')
const res_btn = tc.querySelector('.res')

// 发送请求函数
const pa = (sql, callback) => {
  axios({
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: localStorage.getItem('token') },
    method: 'post',
    url: '/cart',
    data: Qs.stringify({
      sql
    })
  })
    .then(data => {
      callback && callback(data)
    })
    .catch(err => {
      throw err
    })
}

// 返回购物车函数
const back = txt => {
  tc.className = 'alertbox back'
  let time = 5
  let bg = tc.querySelector('.bg')
  bg.innerHTML = `<span>${txt}，${time--}秒后<a href='/cart'>返回</a>购物车</span>`
  let iev = setInterval(() => {
    if (time > 0) {
      bg.innerHTML = `<span>${txt}，${time--}秒后<a href='/cart'>返回</a>购物车</span>`
    } else {
      clearInterval(iev)
      window.location.href = '/cart'
    }
  }, 1000)
}

let id = []

pa('select * from cart where isjs="t" and orderStatus="待结算"', d => {
  if (Object.prototype.toString.call(d.data) == '[object Array]') {
    d.data.forEach(i => {
      id.push(i.id)
    })
  } else {
    window.location.replace('/index')
  }
})

// 提交订单按钮
submit.onclick = () => {
  tc.className = 'alertbox active'
  pa('update cart set orderStatus="等待买家付款",submitTime=now() where isjs="t" and orderStatus="待结算"')
}

tc.querySelector('.bg').onclick = e => {
  back('取消支付成功')
}

// 取消支付按钮
rej_btn.onclick = () => {
  rej_btn.className = 'rej_btn click'
  setTimeout(() => {
    rej_btn.className = 'rej'
  }, 300)
  back('取消支付成功')
}

// 成功支付按钮
res_btn.onclick = () => {
  res_btn.className = 'res_btn click'
  setTimeout(() => {
    res_btn.className = 'res'
  }, 300)
  id.forEach(i => {
    pa(`update cart set orderStatus="交易成功",resTime=now() where id=${i}`)
  })
  back('支付成功')
  // window.history.go(-1)
  // location.replace(document.referrer)
}

// 退出关闭弹窗结算
window.onunload = () => {
  tc.className = 'alertbox'
}
