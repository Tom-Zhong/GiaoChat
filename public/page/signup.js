requirejs(['axios', 'jquery', 'popper', 'bootstrap'], function(axios, $) {
  console.log('[Page] Signup Page Loaded');
  var UIComponents = {
    nameInputBox: $('#name'),
    emailInputBox: $('#email'),
    ageInputBox: $('#age'),
    pwdInputBox: $('#password'),
    signupBtn: $('#signup-btn'),
    signupStatus: $('#signup-btn .spinner-border'),
    resultText: $('#modal-body'),
    signupModal: $('#signup-modal')
  }

  function initializeForm () {
    UIComponents.signupStatus.hide()
  }

  function getForm() {
    return UIComponents.nameInputBox.val()
    && UIComponents.emailInputBox.val()
    && UIComponents.ageInputBox.val()
    && UIComponents.pwdInputBox.val()
      ? {
          name: UIComponents.nameInputBox.val() || '',
          email: UIComponents.emailInputBox.val() || '',
          age: UIComponents.ageInputBox.val() || '',
          pwd: UIComponents.pwdInputBox.val() || ''
        }
      : false
  }

  UIComponents.signupBtn.click(function() {
    UIComponents.signupStatus.show()

    var form = getForm();

    UIComponents.signupBtn.attr('disabled', 'true')
    if (!form) {
      UIComponents.resultText = '请输入必填信息谢谢！'
      UIComponents.signupModal.modal('show')
    } else {
      axios.post('/v1/user/signup', form).then(res => {
        var data = res.data
        console.log(res)
        localStorage.setItem('token', data.token)
        localStorage.setItem('tokenExpireTime', data.createTime)
        localStorage.setItem('uid', data.id)
        UIComponents.resultText.html('注册成功')
        UIComponents.signupModal.modal('show')
        UIComponents.signupStatus.hide();
        UIComponents.signupBtn.removeAttr('disabled')
      })
    }
  })

  initializeForm()
})
