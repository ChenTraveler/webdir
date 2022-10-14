// 获取验证码
let vnum
getverification.onclick = () => {
  vnum = parseInt(Math.random() * 888888 + 111111)
  getverification.className = 'disable'
  let time = 5
  let djs = setInterval(() => {
    if (time > 0) {
      getverification.innerHTML = time-- + '秒后可重新发送'
    } else {
      time = 5
      getverification.className = ''
      getverification.innerHTML = '获取验证码'
      clearInterval(djs)
    }
  }, 1000)
  alert('验证码为' + vnum)
}

// 电话前缀
let sel = document.querySelector('select')
sel.onchange = () => {
  sel.parentNode.setAttribute('data-content', sel.value)
}

// 同意协议切换事件
agreement.onclick = () => {
  if (check.className.includes('icon-roundcheckfill')) {
    check.className = 'iconfont icon-round'
  } else {
    check.className = 'iconfont icon-roundcheckfill'
  }
}

// 密码显示隐藏
eye.onclick = () => {
  if (eye.className.includes('icon-no_eye')) {
    eye.className = 'iconfont icon-attentionfill'
    pwd.setAttribute('type', 'text')
  } else {
    eye.className = 'iconfont icon-no_eye'
    pwd.setAttribute('type', 'password')
  }
}
