import io from 'socket.io'
import http from 'http'

const initializeSocketIO = server => {
  const ioInstance = io(server)
  ioInstance.sockets.on('connection', socket => {
    socket.on('message', function(message) {
      message = JSON.parse(message)
      message.message = (socket.name || '无名氏') + ': ' + message.message

      if (message.type == 'userMessage') {
        socket.broadcast.send(JSON.stringify(message))
        message.type = 'myMessage'
        socket.send(JSON.stringify(message))
      }
    })

    socket.on('set_name', function(data) {
      socket.name = data.name

      socket.emit('name_set', data)
      socket.send(
        JSON.stringify({
          type: 'serverMessage',
          message: `${data.name}, 欢迎来到Giao聊天！`
        })
      )
    })
  })
}

export { initializeSocketIO }
