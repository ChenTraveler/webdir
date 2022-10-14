// 获取元素
let form = document.querySelector('form')
let agreement = document.querySelector('.agreement')
let check = agreement.children[0]
let tap = document.querySelector('.tap')
let eye = document.querySelector('.apwd .pwd i')
let btn = document.querySelector('[type="submit"]')
let uname = document.querySelector('[name="uname"]')
let pwd = document.querySelector('[name="pwd"]')
let phone = document.querySelector('[name="phone"]')
let verification = document.querySelector('[name="verification"]')
let getverification = document.querySelector('[name="verification"]+a')

let a = (phone, uname, pwd) => {
  axios({
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'POST',
    url: '/login',
    data: Qs.stringify({
      phone,
      uname,
      pwd
    })
  })
    .then(data => {
      if (typeof data.data == 'string') {
        alert(data.data)
        if (data.data.includes('未注册')) {
          window.location.href = '/rej'
        }
        if (data.data.includes('登入成功')) {
          window.history.go(-1)
          location.replace(document.referrer)
        }
      } else {
        alert('用户名或者密码错误，请重新输入')
      }
    })
    .catch(err => alert('因为网络问题，登录失败，清稍后重试'))
}

btn.onclick = e => {
  e = e || window.event
  e.preventDefault()
  if (form.className == 'active_sms') {
    let reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
    if (reg.test(phone.value)) {
      console.log(vnum)
      if (verification.value != '' && verification.value == vnum) {
        if (check.className.includes('icon-roundcheckfill')) {
          a(phone.value)
        } else {
          alert('请认真阅读服务协议与隐私保护并同意协议')
        }
      } else {
        alert('请输入正确的验证码')
        verification.focus()
      }
    } else {
      alert('请输入有效的电话号码')
      phone.focus()
    }
  } else if (form.className == 'active_apwd') {
    if (uname.value != '') {
      if (pwd.value != '') {
        if (check.className.includes('icon-roundcheckfill')) {
          a(null, uname.value, pwd.value)
        } else {
          alert('请认真阅读服务协议与隐私保护并同意协议')
        }
      } else {
        alert('密码不能为空')
        pwd.focus()
      }
    } else {
      alert('用户名不能为空')
      uname.focus()
    }
  }
}

// 电话账号登录切换点击事件
tap.onclick = () => {
  if (form.className.includes('active_sms')) {
    form.className = 'active_apwd'
    tap.innerHTML = '短信验证码登录'
  } else {
    form.className = 'active_sms'
    tap.innerHTML = '账号密码登录'
  }
}
