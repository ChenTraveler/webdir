// 轮播图
const s = new Swiper('.index_container .main>.swiper-container', {
  autoplay: 3000, // 自动播放
  autoplayDisableOnInteraction: false, // 操作是否停止自动播放
  loop: true, // 循环
  pagination: '.swiper-pagination' // 分页器
})

const s1 = new Swiper('.index_container .list .swiper-container', {
  noSwiping: true // 禁止滑动
})

// 选项卡
const navs = document.querySelectorAll('.index_container .list .nav div')
const cont = document.querySelector('.index_container .list .content .swiper-wrapper')

const cw = cont.offsetWidth

navs.forEach((i, index) => {
  i.onclick = () => {
    navs.forEach(i => {
      i.className = ''
    })
    i.className = 'active'
    cont.style.transform = 'translate(' + -index * cw + 'px)'
  }
})

// 滑到底部出现更多
const uls = document.querySelectorAll('.index_container .footer .goods_list ul')
const list = document.querySelector('.index_container .list')
const footer = document.querySelector('.index_container .footer')

// 创建模板
Waterfall.prototype._cre = data => {
  let li = document.createElement('li')
  let div = document.createElement('div')
  li.appendChild(div)
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
      if (data.sales) {
        price.innerHTML += `<span class="count">${getstrnum(data.sales)}人付款</span>`
      }
    }
  }
  if (data.route) {
    div.addEventListener('click', () => {
      window.location.href = data.route
    })
  }
  return li
}
