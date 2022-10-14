const getstrnum = n => {
  let num
  n > 10000 ? (num = parseInt(n / 10000) + '万+') : n > 1000 ? (num = parseInt(n / 1000) + '000+') : n > 100 ? (num = parseInt(n / 100) + '00+') : (num = n)
  return num
}

// 构造函数
function Waterfall(objs, datas, flag = false) {
  let _this = this
  // 存储所有列
  this.objs = objs
  // 存储高度最小的列
  this.obj = objs[0]
  // 存储数据
  this.datas = datas
  // 清空
  this.objs.forEach(i => {
    i.innerHTML = ''
  })
  if (flag) {
    // 初始化
    this.datas.goods.forEach(i => {
      _this._add(i)
    })
    // 添加完加载图片
    let imgs = document.querySelectorAll('.goods_list .goods img')
    this._imgsload(imgs)
  } else {
    // 监听滚动条到底添加
    document.addEventListener(
      'scroll',
      (this.add = () => {
        _this._scroll()
      })
    )
  }
}

// 判断滚动条到底添加
Waterfall.prototype._scroll = function (event) {
  let _this = this
  event = event || window.event
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop || 0
  let windowHeight = document.documentElement.scrollHeight || document.body.scrollHeight || window.innerHeight
  let bottom
  if (list) {
    bottom = list.offsetTop + list.offsetHeight - window.innerHeight
  } else {
    bottom = windowHeight - window.innerHeight
  }
  // 判断添加
  if (bottom <= scrollTop) {
    footer && (footer.style.display = 'flex')
    this.datas.goods.forEach(i => {
      _this._add(i)
    })

    // 添加完清除事件
    document.removeEventListener('scroll', this.add)

    // 添加完加载图片
    let imgs = document.querySelectorAll('.goods_list .goods img')
    this._imgsload(imgs)
  }
}
Waterfall.prototype._imgsload = imgs => {
  imgs.forEach(i => {
    i.src = i.getAttribute('data-src')
    i.removeAttribute('data-src')
  })
}

// 找出高度最小的列
Waterfall.prototype._ul_sort = function () {
  let arr = []
  for (let i = 0; i < this.objs.length; i++) {
    arr.push(this.objs[i].offsetHeight)
  }

  let arrmap = arr.map(i => i)

  this._maopao(arrmap)
  this.obj = this.objs[arr.indexOf(arrmap[0])]
}

// 冒泡排序
Waterfall.prototype._maopao = arr => {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = temp
      }
    }
  }
  return arr
}

// // 创建模板
// Waterfall.prototype._cre = data => {
//   let li = document.createElement('li')
//   let div = document.createElement('div')
//   li.appendChild(div)
//   div.className = 'goods'
//   if (data.src) {
//     div.innerHTML += `<div class="pic">
//       <img data-src="${data.src}" alt="" />
//     </div>`
//   }
//   if (data.title) {
//     div.innerHTML += `<div class="details"><div class="model"></div></div>`
//     let details = div.querySelector('.details')
//     let model = details.querySelector('.model')
//     model.innerHTML += `<span class="title ellipsis">${data.title}</span>`
//     if (data.advantage) {
//       model.innerHTML += `<span class="advantage ellipsis">${data.advantage}</span>`
//     }
//     if (data.price) {
//       details.innerHTML += `<div class="price">
//           <span class="rmb">￥</span>
//           <span class="num">${data.price.toFixed(0)}</span>
//           <span class="smallnum">${(data.price - parseInt(data.price)).toFixed(1).slice(1)}</span>
//         </div>`
//       let price = details.querySelector('.price')
//       if (data.sales) {
//         price.innerHTML += `<span class="count">${getstrnum(data.sales)}人付款</span>`
//       }
//     }
//   }
//   if (data.route) {
//     div.addEventListener('click', () => {
//       window.location.href = data.route
//     })
//   }
//   return li
// }

// 添加
Waterfall.prototype._add = function (data) {
  let li = this._cre(data)
  this.obj.appendChild(li)
  this._ul_sort()
}

// 根据键获取cookie值
const getcookie = objname => {
  let arr
  if (document.cookie.includes(';')) {
    arr = document.cookie.replaceAll('; ',';').split(';')
  } else {
    arr = document.cookie.split()
  }
  arr.forEach((i, index) => {
    arr[index] = i.split('=')
  })
  let str
  arr.forEach(i => {
    i.forEach((e, index) => {   
      if (e == objname) {
        str= i[index+1]
      }
    })
  })
  return str
}