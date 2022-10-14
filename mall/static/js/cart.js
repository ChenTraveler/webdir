// 获取元素
const box = document.querySelector('.cart_container')
const jprice = document.querySelector('.cart_container .total .price .num')
const jbtn = document.querySelector('.cart_container .total .submit')
const jbtn_span = jbtn.querySelector('span')
const goods = document.querySelectorAll('.main .goods')

// 发送请求函数
const pa = (sql, callback) => {
  axios({
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'post',
    url: 'cart',
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

// 计算
const count = function () {
  let sum = 0
  let index = 0

  const goodsc = document.querySelectorAll('.cart_container .main .store .goods.active')

  goodsc.forEach(i => {
    sum += i.querySelector('.price .num').innerHTML * i.querySelector('.count input').value
    index++
  })

  jprice.innerHTML = sum

  if (index > 0) {
    jbtn.className = jbtn.className.replaceAll(' disabled', '')
  } else {
    jbtn.className = 'submit disabled'
  }

  jbtn_span.innerHTML = index
}
count()

// 店铺全选判断
const dpqxpd = parent => {
  const goods = parent.querySelectorAll('.goods')
  const choice = parent.querySelector('.top .choice')
  for (let i = 0; i < goods.length; i++) {
    if (!goods[i].className.includes('active')) {
      choice.className = 'choice'
      return false
    } else {
      choice.className = 'choice active'
    }
  }
}

// 所有全选判断
const qxpd = () => {
  const goods = document.querySelectorAll('.main .goods')
  const choice = document.querySelector('.total .choice')
  for (let i = 0; i < goods.length; i++) {
    if (!goods[i].className.includes('active')) {
      choice.className = 'choice'
      return false
    } else {
      choice.className = 'choice active'
    }
  }
}

// 点击选择
const stores = document.querySelectorAll('.cart_container .main .store')
stores.forEach(m => {
  const goods = m.querySelectorAll('.goods')
  goods.forEach(i => {
    const choices = i.querySelector('.choice')
    choices.onclick = () => {
      if (i.className.includes('active')) {
        i.className = i.className.replaceAll(' active', '')
      } else {
        i.className = 'goods active'
      }
      count()
      dpqxpd(m)
      qxpd()
    }
  })
})

// 点击店铺全选
stores.forEach(i => {
  const choice = i.querySelector('.top .choice')
  const goods = i.querySelectorAll('.goods')
  choice.onclick = () => {
    if (choice.className.includes('active')) {
      choice.className = 'choice'
      goods.forEach(i => {
        i.className = 'goods'
      })
    } else {
      choice.className = 'choice active'
      goods.forEach(i => {
        i.className = 'goods active'
      })
    }
    count()
    qxpd()
  }
})

// 点击所有全选
const qchoice = document.querySelector('.cart_container .total .choice')
qchoice.onclick = () => {
  if (qchoice.className.includes('active')) {
    qchoice.className = 'choice'
    goods.forEach(i => {
      i.className = 'goods'
    })
  } else {
    qchoice.className = 'choice active'
    goods.forEach(i => {
      i.className = 'goods active'
    })
  }
  count()
  stores.forEach(i => {
    dpqxpd(i)
  })
  qxpd()
}

// 添加事件
const add = document.querySelectorAll('.cart_container .main .store .goods .add')
const sub = document.querySelectorAll('.cart_container .main .store .goods .reduce')
add.forEach((i, index) => {
  const ipt = i.previousElementSibling
  i.onclick = () => {
    ipt.value = parseInt(ipt.value) + 1
    if (ipt.value > 200) {
      ipt.value = 200
      alert('该商品已经达到购买上限了，不能再加了哦~')
    }
    const goods = document.querySelectorAll('.main .goods')
    pa(`update cart set num="${ipt.value}" where id="${goods[index].getAttribute('data-id')}"`)
    count()
  }
  // 更改数值事件
  ipt.onchange = () => {
    if (ipt.value == '' || ipt.value < 1 || /[^\d]/.test(ipt.value)) {
      if (/\d/.test(ipt.value) && ipt.value > 0) {
        ipt.value = Math.round(ipt.value)
      } else {
        ipt.value = 1
      }
    }
    if (ipt.value > 200) {
      ipt.value = 200
      alert('该商品已经达到购买上限了，不能再加了哦~')
    }
    pa(`update cart set num="${ipt.value}" where id="${goods[index].getAttribute('data-id')}"`)
    count()
  }
})

// 减少事件
sub.forEach((i, index) => {
  const ipt = i.nextElementSibling
  i.onclick = () => {
    if (ipt.value > 1) {
      ipt.value = parseInt(ipt.value) - 1
    } else {
      alert('该宝贝不能再减少了呦~')
    }
    const goods = document.querySelectorAll('.main .goods')
    pa(`update cart set num="${ipt.value}" where id="${goods[index].getAttribute('data-id')}"`)
    count()
  }
})

// 切换结算和删除
const tap = document.querySelector('.cart_container .header .aperate')
tap.onclick = () => {
  const right = document.querySelectorAll('.cart_container .total .right')
  right.forEach(i => {
    if (i.className.includes('active')) {
      i.className = i.className.replaceAll(' active', '')
    } else {
      i.className += ' active'
    }
  })
  if (tap.innerHTML == '管理') {
    tap.innerHTML = '完成'
  } else {
    tap.innerHTML = '管理'
  }
}

// 删除
const del = document.querySelector('.cart_container .total .aperate .del')
del.onclick = () => {
  const goodsc = document.querySelectorAll('.main .goods.active')
  goodsc.forEach(i => {
    pa(`delete from cart where id=${i.getAttribute('data-id')} and username="${box.getAttribute('data-uname')}"`)
    // 删除元素
    i.remove()
  })
  // 判断是否删除店铺
  const stores = document.querySelectorAll('.cart_container .main .store')
  stores.forEach(i => {
    if (!i.querySelector('.goods')) {
      i.remove()
    }
  })

  const goods = document.querySelectorAll('.main .goods')
  // 更新头部信息
  document.querySelector('.header h2 span').innerHTML = '(' + goods.length + ')'
  document.querySelector('.header .text span').innerHTML = goods.length

  // 判断是否清空
  if (!goods[0]) {
    document.querySelector('.header').className = 'header empty'
    document.querySelector('.main .empty').className = 'empty active'
    document.querySelector('.total .settlement').className = 'right settlement active'
    document.querySelector('.total .aperate').className = 'right aperate'
  }
  count()
}

// 跳转订单页面
const mine = document.querySelector('.footer .mine')
mine.onclick = () => {
  window.location.href = '/order'
}

// 结算跳转
const jies = document.querySelector('.cart_container .total .submit')
jies.onclick = () => {
  const goodsc = document.querySelectorAll('.main .goods.active')
  goodsc.forEach(i => {
    pa(`update cart set isjs="t" where id="${i.getAttribute('data-id')}"`)
  })
  window.location.href = '/settlement'
}

