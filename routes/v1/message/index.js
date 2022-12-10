import { Router } from 'express'
import mongoose from 'mongoose'
import Message from '../../../models/message'
import Rooms from '../../../models/rooms'
import jwt from "jsonwebtoken";
import {map} from "lodash";
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
        .populate([ { path: 'from', select: 'name'} ])
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


const validAndSendMessage = async (message, socket, userAndSocketidMap) => {
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

      console.log('newMessage', newMessage._id )
      const message = await Message.findOne({
        _id: newMessage._id
      })
          .select('-_id content roomsId from type createTime')
          .populate([ { path: 'from', select: 'name'} ])
      socket.emit('message', message)

      map(allMembers, (member)=>{
        // 获取成员的UserId，发送消息
        const id = member;
        socket.in(userAndSocketidMap[id]).emit('message', message);
      })
    } catch (error) {
      return false
    }

  } catch (error) {
    return false
  }
}

export default message

export {
  validAndSendMessage
}
