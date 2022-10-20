const s = new Swiper('.swiper-container', {
  pagination: '.swiper-pagination', // 分页器
  paginationType: 'fraction' // 分页器类型
})

const cart_btn = document.querySelector('.details_container .top_btn .cart_btn')

// 发送请求函数
const pa = (url, data, callback) => {
  axios({
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Authorization: localStorage.getItem('token') },
    method: 'post',
    url,
    data: Qs.stringify(data)
  })
    .then(data => {
      callback && callback(data)
    })
    .catch(err => {
      throw err
    })
}

// 跳转购物车
cart_btn.onclick = () => {
  if (localStorage.getItem('token')) {
    window.location.href = `/cart`
  } else {
    alert('请先登录')
    window.location.href = '/login'
  }
}

// 返回上一级
document.querySelector('.details_container .top_btn .back_btn').onclick = () => {
  window.history.go(-1)
  location.replace(document.referrer)
}

// 跳转登录
const login_btn = document.querySelector('.top_btn .menu')
login_btn.onclick = () => (location.href = '/login')

// 跳转首页
const shop_btn = document.querySelector('.bottom_btn .shop')
shop_btn.onclick = () => (location.href = '/index')

// 点击出现规格弹窗
const ggtc = document.querySelector('.guige')
// 打开
const opentc = () => {
  document.body.className = 'add'
  ggtc.className = 'guige active'
}
// 关闭
const closetc = () => {
  document.body.className = ''
  ggtc.className = 'guige close'
  setTimeout(() => {
    ggtc.className = 'guige'
  }, 500)
}

// 打开弹窗（购买）按钮
const optcbtn = document.querySelectorAll('.bottom_btn .right>div')

optcbtn.forEach(i => {
  i.onclick = () => opentc()
})

// 点击关闭
const closebtn = document.querySelector('.guige .close')
const bg = document.querySelector('.guige .bg')

closebtn.onclick = () => closetc()
bg.onclick = () => closetc()

const options = document.querySelectorAll('.guige .option')
const sel = document.querySelector('.guige .top .tips .sel')
const seltext = document.querySelectorAll('.guige .top .tips u')
const psel = document.querySelector('.guige .top .tips .psel')
const pseltext = document.querySelectorAll('.guige .top .tips b')
const pricelist = JSON.parse(document.querySelector('.data .dsprice').innerHTML).price
const pricenum = document.querySelector('.guige .top .cont .price .num')
const minprice = Math.min(...pricelist.flat(Infinity))
const maxprice = Math.max(...pricelist.flat(Infinity))
const stocks = JSON.parse(document.querySelector('.data .dsstock').innerHTML).stock
let stock = 0

// 判断是否有选项选中
const selpd = () => {
  const opconts = document.querySelectorAll('.guige .opcont')
  for (let i = 0; i < opconts.length; i++) {
    if (opconts[i].className.includes('active')) {
      sel.className = 'sel active'
      return false
    } else {
      sel.className = 'sel'
    }
  }
}

const pselpd = () => {
  const opconts = document.querySelectorAll('.guige .opcont.active')
  let num = 0
  let arr = []
  opconts.forEach(i => {
    num++
    arr.push(i.getAttribute('data-i'))
  })
  if (num == options.length) {
    psel.className = 'psel active'
    let num = pricelist.map(i => i)
    stock = stocks.map(i => i)
    arr.forEach(i => {
      num = num[i]
      stock = stock[i]
    })
    pricenum.innerHTML = num
  } else {
    psel.className = 'psel'
    if (minprice != maxprice) {
      pricenum.innerHTML = minprice + '-' + maxprice
    } else {
      pricenum.innerHTML = minprice
    }
  }
}

// 规格选项点击事件
options.forEach((i, k) => {
  const opconts = i.querySelectorAll('.opcont')
  opconts.forEach((i, index) => {
    const opname = i.previousElementSibling
    i.onclick = () => {
      if (i.className.includes('active')) {
        i.className = 'opcont'
        seltext[k].className = ''
        seltext[k].innerHTML = ''
        pseltext[k].className = ''
      } else {
        i.className = 'opcont active'
        seltext[k].className = 'active'
        seltext[k].innerHTML = i.innerHTML
        pseltext[k].className = 'active'
      }
      opconts.forEach((i, index1) => {
        if (index != index1) {
          i.className = 'opcont'
        }
      })
      selpd()
      pselpd()
    }
  })
})

const add = document.querySelector('.guige .quantity .add')
const ipt = document.querySelector('.guige .quantity input')
const sub = document.querySelector('.guige .quantity .sub')

// 减少按钮禁用判断
const subdispd = () => {
  if (ipt.value > 1) {
    sub.className = 'sub'
  } else {
    sub.className = 'sub disabled'
  }
}

// 添加事件
add.onclick = () => {
  ipt.value = parseInt(ipt.value) + 1
  if (ipt.value > 200) {
    ipt.value = 200
    alert('该商品已经达到购买上限了，不能再加了哦~')
  }
  subdispd()
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
  subdispd()
}

// 减少事件
sub.onclick = () => {
  ipt.value = parseInt(ipt.value) - 1
  subdispd()
}

const createtc = (str, ac = 'tc') => {
  alertbox.innerHTML = `<div class='alert ${ac}'>${str}</div>`
  setTimeout(() => {
    document.querySelector(`.alert.${ac}`).remove()
  }, 2000)
}

const addcart = document.querySelector('.guige .bottom .add')
const buy = document.querySelector('.guige .bottom .buy')
const alertbox = document.querySelector('.alertbox')

// 获取数据
const shoptitle = document.querySelector('.data .dsshoptitle').innerHTML
const id = document.querySelector('.data .dsid').innerHTML
const csrc = document.querySelector('.guige .top .pic img').src
const src = csrc.slice(csrc.indexOf('/img'))
const title = document.querySelector('.main .cardTitle .title').innerHTML
let coupon = 0

// 加入购物车
addcart.onclick = () => {
  if (psel.className.includes('active')) {
    let option = ''
    const opconts = document.querySelectorAll('.guige .opcont.active')
    opconts.forEach(i => {
      option += ';' + i.innerHTML
    })
    if (document.querySelector('.Coupon')) {
      if (pricenum.innerHTML * ipt.value > document.querySelector('.Coupon .constraint').innerHTML) {
        coupon = document.querySelector('.Coupon .num').innerHTML
      }
    }
    if (localStorage.getItem('token')) {
      pa(
        '/details',
        {
          uname,
          shoptitle,
          title,
          src,
          option: option.slice(1),
          price: pricenum.innerHTML,
          num: ipt.value,
          coupon,
          stock,
          id
        },
        d => {
          if (d.data) {
            createtc('成功加入购物车', 'add')
          } else {
            createtc('因网络问题，加入失败，请稍后重试', 'add')
          }
          closetc()
        }
      )
    } else {
      alert('请先登录')
      location.href = '/login'
    }
  } else {
    let str = psel.innerHTML
    pseltext.forEach(i => {
      if (!i.className.includes('active')) {
        str += '    ' + i.innerHTML
      }
    })
    createtc(str, 'qqx')
  }
}

// 购买
buy.onclick = () => {
  if (psel.className.includes('active')) {
    let option = ''
    const opconts = document.querySelectorAll('.guige .opcont.active')
    opconts.forEach(i => {
      option += ';' + i.innerHTML
    })
    if (document.querySelector('.Coupon')) {
      if (pricenum.innerHTML * ipt.value > document.querySelector('.Coupon .constraint').innerHTML) {
        coupon = document.querySelector('.Coupon .num').innerHTML
      }
    }
    if (localStorage.getItem('token')) {
      pa(
        '/cart',
        {
          sql: `insert into cart (username,shoptitle,title,src,options,price,num,coupon,stock,goodsid,isjs) values ("${uname}","${shoptitle}","${title}","${src}","${option.slice(1)}","${pricenum.innerHTML}","${ipt.value}","${coupon}","${stock}","${id}","t")`
        },
        d => {
          if (d.data) {
            // createtc('成功加入购物车', 'add')
            location.href = '/settlement'
          } else {
            createtc('因网络问题，加载失败，请稍后重试', 'add')
          }
          closetc()
        }
      )
    } else {
      alert('请先登录')
      location.href = '/login'
    }
  } else {
    let str = psel.innerHTML
    pseltext.forEach(i => {
      if (!i.className.includes('active')) {
        str += '    ' + i.innerHTML
      }
    })
    createtc(str, 'qqx')
  }
}
