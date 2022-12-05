requirejs(['io', 'jquery'], function(io, $) {
  $(function() {
    var chatCom = io.connect('/chat_com')
    const roomName = decodeURI(
      (RegExp('room' + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
    )
    // console.log(roomName)
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
    }

    chatCom.on('message', function(data) {
      // data = JSON.parse(data)
      console.log(data)
      $('#messages').append(
          '<div>[ 文本信息 ] ' + data + '</div>'
      )
    })
    // if (roomName) {
    //   chatInfra.on('name_set', function(data) {
    //     chatInfra.emit('join_room', { name: roomName })

    //     chatInfra.on('message', function(data) {
    //       data = JSON.parse(data)
    //       console.log(data)
    //       $('#messages').append(
    //         '<div class="' + data.type + '">' + data.message + '</div>'
    //       )
    //     })

    //     chatInfra.on('user_entered', function(data) {
    //       data = JSON.parse(data)
    //       console.log(data)
    //       $('#messages').append(
    //         '<div class="' + data.type + '">' + data.name + '</div>'
    //       )
    //     })
    //   })
    //   chatCom.on('message', function(data) {
    //     data = JSON.parse(data)
    //     console.log(data)
    //     $('#messages').append(
    //       '<div class="' + data.type + '">' + data.message + '</div>'
    //     )
    //   })
    // }

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

    // $('#setname').click(function() {
    //   chatInfra.emit('set_name', { name: $('#nickname').val() })
    //   $('#nameform').css('display', 'none')
    // })
  })
})
