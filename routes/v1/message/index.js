import { Router } from 'express'
import mongoose from 'mongoose'
import Message from '../../../models/message'
import Rooms from '../../../models/rooms'
import jwt from "jsonwebtoken";
const message = Router()

// 通过用户ID获取历史消息
message.post('/:roomsId/:page', async (req, res, next) => {
  const { roomsId, page, } = req.params
  const { token } = req.body
  const decodedData = jwt.verify(token, process.env.JWT_KEY)
  const { userId } = decodedData
  if (!userId || !roomsId || !page) {
    return res.status(400).json({
      code: -1,
      message: '请提供正确的参数'
    })
  }
  try {
    const historyMessages = await Message.find({
      to: { $in: [userId] },
      roomsId
    }).select('-_id content roomsId from type createTime').sort({createTime: -1})
        .populate([ { path: 'from', select: 'name -_id'} ])
        .limit(5)
        .skip(Number(page) * 5)
    res.json({
      code: 0,
      status: 200,
      messages: historyMessages,
      length: historyMessages.length
    })
  } catch (error) {
    console.log(error)
    res.json({
      code: -1,
      message: '服务器炸了'
    })
  }
})


const validAndSendMessage = async (message, socket) => {
  const {
    sender: token,
    receiver: roomsId,
    message: messagePayload
  } = message

  try {
    // 获取发送聊天列表中的所有成员
    const roomsData = await Rooms.find({_id: roomsId})
    const allMembers = roomsData[0].allMembers
    // console.log(allMembers);

    const decodedData = jwt.verify(token, process.env.JWT_KEY)
    const { email, userId: senderID } = decodedData

    try {
      const newMessage = new Message({
        _id: new mongoose.Types.ObjectId(),
        creatorId: senderID,
        content: messagePayload,
        from: senderID,
        to: allMembers,
        unReadMessageMembers: allMembers,
        roomsId,
        type: 0,
      })
      await newMessage.save()
    } catch (error) {
      return false
    }

    // 检查用户是不是在线

    // 如果在线，发送消息，没有在线，等上线后再去获取未读消息

  } catch (error) {
    return false
  }
}

export default message

export {
  validAndSendMessage
}
