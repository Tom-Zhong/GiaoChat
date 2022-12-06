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
      let msg = ''
      axios.post('/v1/user/signup', form).then(res => {
        var data = res.data
        if (data.code && data.code === -1) {
          throw new Error ('Mail exist');
        }
        UIComponents.resultText.html('注册成功! 跳转到登录页面！')
        UIComponents.signupModal.modal('show')
        UIComponents.signupModal.on('hidden.bs.modal', function (event) {
          window.location.href = '/signin'
        })
        UIComponents.signupStatus.hide();
      }).catch(e => {
        console.log('e', e);
        UIComponents.resultText.html(`注册失败了, 请重试, err msg: ${e.message}`)
        UIComponents.signupModal.modal('show')
      }).finally(() => {
        UIComponents.signupStatus.hide()
        UIComponents.signupBtn.removeAttr('disabled')
      })
    }
  })

  initializeForm()
})
