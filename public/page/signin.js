requirejs(['axios', 'jquery', 'popper', 'bootstrap'], function(axios, $) {
  var UIComponents = {
    emailInputBox: $('#email'),
    pwdInputBox: $('#password'),
    signupBtn: $('#signup-btn'),
    resultText: $('#modal-body'),
    signinModal: $('#signin-modal'),
    signinStatus: $('#signup-btn .spinner-border'),
  }
  function getForm() {
    return UIComponents.emailInputBox.val() && UIComponents.pwdInputBox.val()
      ? {
          email: UIComponents.emailInputBox.val() || '',
          pwd: UIComponents.pwdInputBox.val() || ''
        }
      : false
  }
  function initilizeSignInPage () {
    UIComponents.signinStatus.hide()
  }
  UIComponents.signupBtn.click(function() {
    var form = getForm()
    UIComponents.signupBtn.attr('disabled', 'true')
    if (!form) {
      UIComponents.resultText = '请输入账号密码谢谢！'
      UIComponents.signinModal.modal('show')
    } else {
      UIComponents.signinStatus.show()
      axios.post('/v1/user/login', form).then(res => {
        var data = res.data
        console.log(res)
        localStorage.setItem('token', data.token)
        localStorage.setItem('tokenExpireTime', data.createTime)
        localStorage.setItem('uid', data.id)
        UIComponents.resultText.html('登陆成功')
        UIComponents.signinModal.modal('show')
        window.location.href = '/main'
      }).finally(() => {
        UIComponents.signinStatus.hide()
      })
    }
    UIComponents.signupBtn.removeAttr('disabled')
  })
  initilizeSignInPage()
})
