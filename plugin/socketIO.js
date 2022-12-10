import io from 'socket.io'
import jwt from 'jsonwebtoken'
import { map, forIn } from 'lodash'
import Rooms from '../models/rooms'
import { settingUserOnlineStatus } from '../routes/v1/user/index'
import { validAndSendMessage } from '../routes/v1/message/index'
import { sendGoOnlineInfo } from '../routes/v1/friend/index'
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
    // 用户登录，发送token给Socket.io绑定与用户响应的socket
    socket.on('bindSocket', async (userData) => {
      try {
        const userDataObj = JSON.parse(userData)
        const { token } = userDataObj
        const decodedData = jwt.verify(token, process.env.JWT_KEY)
        const { email, userId } = decodedData
        socket.email = email
        socket.userId = userId

        if (userAndSocketidMap[userId] !== null) {
          await sendGoOnlineInfo(userId, email,  socket, userAndSocketidMap, "上线啦")
        }

        userAndSocketidMap[userId] = socket.id

        // 用户登陆，设置用户在线状态
        if (userId) {
          console.log('userId1', userId);
          settingUserOnlineStatus(userId, 1)
        }
      } catch (e) {
        console.log(e);
      }
    })

    // 接收来自用户的讯息
    socket.on('message', async function(message) {

      // 从token里面解析出用户的id，利用id绑定相应的socket，方便实时发送信息
      message = JSON.parse(message)
      const {
        receiver: roomsId,
        message: messagePayload,
        sender: token
      } = message;

      const decodedData = jwt.verify(token, process.env.JWT_KEY)
      const { email, userId } = decodedData

      // 查找此房间的数据
      const roomsData = await Rooms.findOne({_id: roomsId})

      // 获取房间中所有的成员
      const allMembers = roomsData.allMembers
      // console.log(userAndSocketidMap, allMembers)

      await validAndSendMessage(message, socket, userAndSocketidMap)
    })

    // 用户断开后、清除用户的在线状态
    socket.on('disconnect', async () => {
      console.log('用户离线了 ', socket.userId)
      userAndSocketidMap[socket.userId] = null
      // 用户离开了
      await settingUserOnlineStatus(socket.userId, 0)
    })

  })
  setInterval(() => {
    forIn(userAndSocketidMap, (value, key) => {
      if (value === null) {
        delete userAndSocketidMap[key]
      }
    })
  }, 15000)
}

export { initializeSocketIO }
