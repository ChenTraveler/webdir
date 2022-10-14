// 关注
const follow = document.querySelector('.container .follow')
follow.onclick = () => {
  const conts = follow.querySelectorAll('.cont')
  let flag = 'f'

  conts.forEach(i => {
    if (i.className == 'cont') {
      i.className = 'cont active'
    } else {
      i.className = 'cont'
    }
  })

  const cont = document.querySelector('.cont.active span')

  if (cont.innerHTML == '关注') {
    flag = 'f'
  } else {
    flag = 't'
  }

  axios({
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'post',
    url: '/follow',
    data: Qs.stringify({
      flag
    })
  })
    .then(data => data)
    .catch(err => {
      throw err
    })
}

// 头部导航
const nav = document.querySelector('.container .header .bottom')
const fixed_nav = document.querySelector('.container .header .fixed_nav')

window.addEventListener('scroll', () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop || 0
  if (scrollTop >= nav.offsetTop) {
    fixed_nav.style.display = 'block'
  } else {
    fixed_nav.style.display = 'none'
  }
})

// 跳转登录
const login_btn = document.querySelector('.header .top .menu')
login_btn.onclick = () => location.href = '/login'