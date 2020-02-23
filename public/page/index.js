requirejs(['io', 'jquery'], function(io, $) {
  $(function() {
    const chatInfra = io.connect('/chat_infra'),
      chatCom = io.connect('/chat_com')
    const roomName = decodeURI(
      (RegExp('room' + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
    )

    if (roomName) {
      chatInfra.on('name_set', function(data) {
        chatInfra.emit('join_room', { name: roomName })

        chatInfra.on('message', function(data) {
          data = JSON.parse(data)
          console.log(data)
          $('#messages').append(
            '<div class="' + data.type + '">' + data.message + '</div>'
          )
        })

        chatInfra.on('user_entered', function(data) {
          data = JSON.parse(data)
          console.log(data)
          $('#messages').append(
            '<div class="' + data.type + '">' + data.name + '</div>'
          )
        })
      })
      chatCom.on('message', function(data) {
        data = JSON.parse(data)
        console.log(data)
        $('#messages').append(
          '<div class="' + data.type + '">' + data.message + '</div>'
        )
      })
    }

    $('#send').click(function() {
      var data = {
        message: $('#message').val(),
        type: 'userMessage'
      }
      chatCom.send(JSON.stringify(data))
      $('#message').val('')
    })

    $('#setname').click(function() {
      chatInfra.emit('set_name', { name: $('#nickname').val() })
      $('#nameform').css('display', 'none')
    })
  })
})
