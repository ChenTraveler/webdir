// 发送请求函数
const pa = (sql, callback) => {
  axios({
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
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

// 删除订单按钮

const del = document.querySelectorAll('.order .btn_list .del')
del.forEach((i, index) => {
  i.onclick = () => {
    const order = i.parentNode.parentNode.parentNode
    pa(`update cart set orderflag="f" where id=${order.getAttribute('data-id')}`)
    order.remove()
  }
})

// 取消订单按钮
const qx = document.querySelectorAll('.order .btn_list .qx')
qx.forEach(i => {
  i.onclick = () => {
    const order = i.parentNode.parentNode.parentNode
    pa(`update cart set orderStatus="交易关闭",resTime=now() where id=${order.getAttribute('data-id')}`)
    location.reload()
  }
})

// 付款按钮
const fk = document.querySelectorAll('.order .btn_list .fk')
fk.forEach(i => {
  i.onclick = () => {
    const order = i.parentNode.parentNode.parentNode
    pa(`update cart set orderStatus="交易成功",resTime=now() where id=${order.getAttribute('data-id')}`)
    location.reload()
  }
})

// 更多按钮
const more = document.querySelectorAll('.order .btn_list .more')
more.forEach(i => {
  i.onclick = () => {
    if (i.className.includes('active')) {
      i.className = 'more'
    } else {
      i.className = 'more active'
    }
  }
})
