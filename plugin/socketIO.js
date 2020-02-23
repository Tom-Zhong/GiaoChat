import io from 'socket.io'
import http from 'http'

const initializeSocketIO = function(server) {
  const ioInstance = io(server)
  const _self = this

  this.chatInfra = ioInstance.of('/chat_infra')
  this.chatInfra.on('connection', function(socket) {
    socket.on('message', function(message) {
      message = JSON.parse(message)
      message.message = (socket.name || '无名氏') + ': ' + message.message

      // if (message.type == 'userMessage') {
      //   socket.broadcast.send(JSON.stringify(message))
      //   message.type = 'myMessage'
      //   socket.send(JSON.stringify(message))
      // }
    })

    socket.on('set_name', function(data) {
      socket.nickname = data.name

      socket.emit('name_set', data)
      socket.send(
        JSON.stringify({
          type: 'serverMessage',
          message: `${data.name}, 欢迎来到Giao聊天！`
        })
      )
    })

    socket.on('join_room', function(room) {
      socket.join(room.name)
      const comSocket = _self.chatCom.sockets['/chat_com#' + socket.conn.id] // 这里使用拼接的手段获取同一个socket
      comSocket.join(room.name)
      comSocket.room = room.name
      socket
        .in(room.name)
        .broadcast.emit(
          'user_entered',
          JSON.stringify({ name: socket.nickname, type: 'systemMessage' })
        )
    })

    socket.on('get_rooms', function() {
      var rooms = {}
      // console.log( this.adapter.rooms)
      for (var room in this.adapter.rooms) {
        if (room.indexOf('/chat_infra') == -1) {
          var roomName = room.replace('/chat_infra/', '')
          rooms[roomName] = this.adapter.rooms[room].length
          console.log(rooms)
        }
      }
      socket.emit('rooms_list', rooms)
    })
  })

  this.chatCom = ioInstance.of('/chat_com')
  this.chatCom.on('connection', function(socket) {
    socket.on('message', function(message) {
      message = JSON.parse(message)
      if (message.type == 'userMessage') {
        socket.in(socket.room).broadcast.send(JSON.stringify(message))
        message.type = 'myMessage'
        socket.send(JSON.stringify(message))
      }
    })
  })
}

export { initializeSocketIO }
