import io from 'socket.io'
import http from 'http'
import jwt from 'jsonwebtoken'
import { map } from 'lodash'
import Rooms from '../models/rooms'
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
  const userAndSocketidMap = {};
  this.chatCom = ioInstance.of('/chat_com')
  this.chatCom.on('connection', function(socket) {
    socket.on('message', async function(message) {

      // 从token里面解析出用户的id，利用id绑定相应的socket，方便实时发送信息
      message = JSON.parse(message)
      const { sender: token = '', receiver: roomsId, message: messagePayload } = message;
      const decodedData = jwt.verify(token, process.env.JWT_KEY)
      const { email, userId } = decodedData
      socket.email = email
      socket.userId = userId
      userAndSocketidMap[userId] = socket.id
      console.log(userId)
      const roomsData = await Rooms.find({_id: roomsId})
      console.log(roomsData)
      const allMembers = roomsData[0].allMembers
      map(allMembers, (member)=>{
        const id = member._id
        console.log(id)
        socket.in(userAndSocketidMap[id]).emit('message', messagePayload);
      })

    })
  })
}

export { initializeSocketIO }
