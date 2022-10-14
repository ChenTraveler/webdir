// 获取元素
let form = document.querySelector('form')
let agreement = document.querySelector('.agreement')
let check = agreement.children[0]
let btn = document.querySelector('[type="submit"]')
let uname = document.querySelector('[name="uname"]')
let pwd = document.querySelector('[name="pwd"]')
let eye = document.querySelector('[name="pwd"]+i')
let pwdcopy = document.querySelector('[name="pwdcopy"]')
let eyecopy = document.querySelector('[name="pwdcopy"]+i')
let phone = document.querySelector('[name="phone"]')
let verification = document.querySelector('[name="verification"]')
let getverification = document.querySelector('[name="verification"]+a')

let a = (phone, uname, pwd) => {
  axios({
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'POST',
    url: '/rej',
    data: Qs.stringify({
      phone,
      uname,
      pwd
    })
  })
    .then(data => {
      if (typeof data.data == 'string') {
        alert(data.data)
        if (data.data.includes('注册成功')) {
          window.location.href = '/login'
        }
      } else {
        alert('因为网络问题，注册失败，清稍后重试')
      }
    })
    .catch(err => alert('因为网络问题，注册失败，清稍后重试'))
}

btn.onclick = e => {
  e = e || window.event
  e.preventDefault()
  let phone_reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
  let uname_reg = /^[a-zA-Z0-9\u4E00-\u9FA5_-]{2,14}$/
  let pwd_reg = /^[a-zA-Z0-9_!@#$%^&.*?]{6,16}$/
  if (phone_reg.test(phone.value)) {
    if (verification.value != '' && verification.value == vnum) {
      if (uname.value != '' && uname_reg.test(uname.value)) {
        if (pwd.value != '' && pwd_reg.test(pwd.value)) {
          if (pwdcopy.value == pwd.value) {
            if (check.className.includes('icon-roundcheckfill')) {
              a(phone.value, uname.value, pwd.value)
            } else {
              alert('请认真阅读服务协议与隐私保护并同意协议')
            }
          } else {
            alert('请确认好你的密码')
            pwdcopy.focus()
          }
        } else {
          alert('请输入有效的密码，不能包含空格特殊字符，6-16位')
          pwd.focus()
        }
      } else {
        alert('请输入有效的用户名，不能包含空格和特殊字符，2-14位')
        uname.focus()
      }
    } else {
      alert('请输入正确的验证码')
      verification.focus()
    }
  } else {
    alert('请输入有效的电话号码')
    phone.focus()
  }
}

// 密码显示隐藏
eyecopy.onclick = () => {
  if (eyecopy.className.includes('icon-no_eye')) {
    eyecopy.className = 'iconfont icon-attentionfill'
    pwdcopy.setAttribute('type', 'text')
  } else {
    eyecopy.className = 'iconfont icon-no_eye'
    pwdcopy.setAttribute('type', 'password')
  }
}
