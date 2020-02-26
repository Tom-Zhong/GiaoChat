import { Router } from 'express'
import mongoose from 'mongoose'
import Message from '../../../models/message'
import Rooms from '../../../models/rooms'
// import checkAuth from '../../../plugin/check-auth'
const message = Router()



const validAndSendMessage = async (message, socket) => {
  const messageObj = JSON.parse(message) || {}
  const { creatorId = 0 , content = '', from = 0, to = 0, roomsId = 0, type = 0 } = messageObj
  if (!creatorId || !content || !from || !to || !roomsId) return false
  try {
    // 获取发送聊天列表中的所有成员
    const roomMembers = Rooms.find({_id: roomsId})

    // 循环创建聊天信息
    await Promise.all(map(roomMembers, async item => {
      const user = item
      try {
        const newMessage = new Message({
          _id: new mongoose.Types.ObjectId(),
          creatorId,
          content,
          from,
          to: user.member, // 发送给成员的ID
          roomsId,
          type
        })
        await newMessage.save()
      } catch (error) {
        return false;
      }
    }))

    // 检查用户是不是在线
 
    // 发送信息、全部异步，不管有没有收到哈哈

  } catch (error) {
    return false
  }
}

export {
  validAndSendMessage
}