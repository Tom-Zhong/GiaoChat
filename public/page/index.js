requirejs(['io', 'jquery'], function(io, $) {
  $(function() {
    const socket = io()
    socket.on('message', function(data) {
      data = JSON.parse(data)
      console.log(data)
      $('#messages').append(
        '<div class="' + data.type + '">' + data.message + '</div>'
      )
    })
    $('#send').click(function() {
      var data = {
        message: $('#message').val(),
        type: 'userMessage'
      }
      socket.send(JSON.stringify(data))
      $('#message').val('')
    })

    $('#setname').click(function() {
      socket.emit('set_name', { name: $('#nickname').val() })
      $('#nameform').css('display', 'none')
    })
  })
})
