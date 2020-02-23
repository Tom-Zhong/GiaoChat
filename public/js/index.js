console.log('当前使用jquery版本: ', $.fn.jquery)
const socket = io()

socket.on('message', function(data) {
  data = JSON.parse(data)
  $('#messages').append(
    '<div class="' + data.type + '">' + data.message + '</div>'
  )
})
