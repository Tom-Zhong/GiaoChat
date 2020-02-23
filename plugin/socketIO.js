import io from 'socket.io'
import http from 'http'

const initializeSocketIO = server => {
  const ioInstance = io(server)
  ioInstance.sockets.on('connection', socket => {
    socket.send(
      JSON.stringify({
        type: 'serverMessage',
        message: 'Welcome to the Giao 聊天室.'
      })
    )
    socket.on('message', function(message) {
      message = JSON.parse(message)
      if (message.type == 'userMessage') {
        socket.broadcast.send(JSON.stringify(message))
        message.type = 'myMessage'
        socket.send(JSON.stringify(message))
      }
    })
  })
}

export { initializeSocketIO }
