requirejs(['axios', 'jquery', 'popper', 'bootstrap'], function(axios, $) {
  var UIComponents = {
    emailInputBox: $('#email'),
    pwdInputBox: $('#password'),
    signupBtn: $('#signup-btn'),
    resultText: $('#modal-body'),
    signupModal: $('#signup-modal')
  }
  function getForm() {
    return UIComponents.emailInputBox.val() && UIComponents.pwdInputBox.val()
      ? {
          email: UIComponents.emailInputBox.val() || '',
          pwd: UIComponents.pwdInputBox.val() || ''
        }
      : false
  }

  UIComponents.signupBtn.click(function() {
    var form = getForm()
    UIComponents.signupBtn.attr('disabled', 'true')
    if (!form) {
      UIComponents.resultText = '请输入账号密码谢谢！'
      UIComponents.signupModal.modal('show')
    } else {
      axios.post('/v1/user/login', form).then(res => {
        const { data, status } = res
        console.log(res)
        localStorage.setItem('token', data.token)
        localStorage.setItem('tokenExpireTime', data.createTime)
        localStorage.setItem('uid', data.id)
        UIComponents.resultText.html('登陆成功')
        UIComponents.signupModal.modal('show')
      })
    }
    UIComponents.signupBtn.removeAttr('disabled')
  })
})
