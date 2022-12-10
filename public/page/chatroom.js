requirejs(['io', 'jquery', 'axios', 'betterScroll'], function(io, $, axios, BtterScroll) {
  $(function() {
    var chatCom = io.connect('/chat_com')
    const roomName = decodeURI(
      (RegExp('room' + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
    )

    function initChatRoom () {
      // 获取用户在浏览器中存储的token，发给服务器，用来绑定服务器中的socket
      function bindSocket () {
        const token = localStorage.getItem('token')
        var data = {
          type: 'bindSocket',
          token: token,
        }
        // console.log(data);
        chatCom.emit('bindSocket', JSON.stringify(data))
      }

      bindSocket()

      let bs = BtterScroll.createBScroll('.scroll-wrapper', {
        // wheel:true,
        scrollbar: true,
        pullDownRefresh: {
          threshold: 70,
          stop: 56,
        },
        scrollY: true,
        boundTime: 800
      })
      bs.on('pullingDown', function () {
        setTimeout(() => {
          bs.finishPullDown()
          bs.refresh()
        }, 2000)
      })
    }

    chatCom.on('message', function(data) {
      if (data.senderInfo) {
        const { senderInfo, messagePayload } = data
        $('#messages').append(
            `<div>[ ${ senderInfo.email } ] ${ messagePayload }</div>`
        )
      };
    });

    $('#send').click(function() {
      const token = localStorage.getItem('token')
      // console.log(token)
      var data = {
        message: $('#message').val(),
        sender: token,
        receiver: roomName
      }
      // console.log('data', data)
      chatCom.send(JSON.stringify(data))
      $('#message').val('')
    })

    initChatRoom();
  })
})
