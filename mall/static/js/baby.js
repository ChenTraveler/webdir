// 初始化
// 创建模板
Waterfall.prototype._cre = data => {
  let div = document.createElement('div')
  div.className = 'goods'
  if (data.src) {
    div.innerHTML += `<div class="pic">
      <img data-src="${data.src}" alt="" />
    </div>`
  }
  if (data.title) {
    div.innerHTML += `<div class="details"><div class="model"></div></div>`
    let details = div.querySelector('.details')
    let model = details.querySelector('.model')
    model.innerHTML += `<span class="title ellipsis">${data.title}</span>`
    if (data.advantage) {
      model.innerHTML += `<span class="advantage ellipsis">${data.advantage}</span>`
    }
    if (data.price) {
      details.innerHTML += `<div class="price">
          <span class="rmb">￥</span>
          <span class="num">${data.price.toFixed(0)}</span>
          <span class="smallnum">${(data.price - parseInt(data.price)).toFixed(1).slice(1)}</span>
        </div>`
      let price = details.querySelector('.price')
      if (data.monthsales) {
        price.innerHTML += `<span class="count">${getstrnum(data.monthsales)}人付款</span>`
      }
    }
  }
  if (data.route) {
    div.addEventListener('click', () => {
      window.location.href = data.route
    })
  }
  return div
}

const goods_list = document.querySelectorAll('.baby_container .main .goods_list')

const pa = sql => {
  axios({
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'POST',
    url: '/baby',
    data: Qs.stringify({
      sql
    })
  })
    .then(data => {
      if (data.data.message) {
        alert(data.data.message)
        window.location.href = '/login'
      } else {
        // 实例化对象
        new Waterfall(goods_list, data.data, true)
        document.querySelectorAll('.baby_container .main .goods_list .model .title').forEach(function (i) {
          i.className = i.className.replaceAll('ellipsis', 'ellipsis-3')
        })
        document.querySelectorAll('.baby_container .main .goods_list .model .advantage').forEach(function (i) {
          i.innerHTML = '包邮'
        })
      }
    })
    .catch(err => {
      throw err
    })
}

pa('select * from goods where page like "index"')

// 选项卡
const baby_navs = document.querySelectorAll('.baby_container .main .top>div')
const baby_goodsList = document.querySelector('.baby_container .main .goods_list')

baby_navs.forEach(i => {
  i.addEventListener('click', function () {
    // 点击切换
    if (!i.className.includes('tab')) {
      baby_navs.forEach(i => {
        if (!i.className.includes('tab')) {
          i.className = i.className.replaceAll(' active', '')
        }
      })
      this.className = this.className + ' active'
    } else {
      if (!this.className.includes('active')) {
        this.children[0].className = 'iconfont icon-list'
        this.className += ' active'
        baby_goodsList.className += ' active'
      } else {
        this.children[0].className = 'iconfont icon-cascades'
        this.className = this.className.replaceAll(' active', '')
        baby_goodsList.className = baby_goodsList.className.replaceAll(' active', '')
      }
    }
  })
})

// 导航
var baby_nav = document.querySelector('.baby_container .main .top')
var baby_navOT = baby_nav.offsetTop

window.addEventListener('scroll', function () {
  var scrollTop = document.documentElement.scrollTop || document.body.scrollTop || 0
  if (scrollTop >= baby_navOT) {
    baby_nav.className = 'top active'
  } else {
    baby_nav.className = 'top'
  }
})

// 综合按钮
const comprehensive = baby_nav.children[0]
comprehensive.addEventListener('click', function () {
  pa('select * from goods where page like "index"')
})
// 销量按钮
const sales = baby_nav.children[1]
sales.addEventListener('click', function () {
  pa('select * from goods where page like "index" order by monthsales desc')
})
// 新品按钮
const newgoods = baby_nav.children[2]
newgoods.addEventListener('click', function () {
  pa('select * from goods where page like "index" and isnew="t" order by recommend desc')
})
// 价格按钮
const price = baby_nav.children[3]
price.addEventListener('click', function () {
  const is = this.querySelectorAll('i')
  const up = is[0]
  const down = is[1]
  if (!up.className.includes('active') && !down.className.includes('active')) {
    up.className += ' active'
  } else {
    is.forEach(i => {
      if (i.className.includes('active')) {
        i.className = i.className.replaceAll('active', '')
      } else {
        i.className += ' active'
      }
    })
  }
  if (up.className.includes('active')) {
    pa('select * from goods where page like "index" order by price')
  } else if (down.className.includes('active')) {
    pa('select * from goods where page like "index"  order by price desc')
  }
})
