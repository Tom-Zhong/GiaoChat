requirejs(['io', 'jquery'], function(io, $) {
  const socket = io()
  socket.on('message', function(data) {
    data = JSON.parse(data)
    $('#messages').append(
      '<div class="' + data.type + '">' + data.message + '</div>'
    )
  })
})