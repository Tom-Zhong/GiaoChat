import { Router } from 'express'
import mongoose from 'mongoose'
import Room from '../../../models/rooms'
// import checkAuth from '../../../plugin/check-auth'
const room = Router()
import { map } from 'lodash'

// 通过用户ID获取房间列表
room.get('/:id', async (req, res, next) => {
  const { id: ownerId = 0 } = req.params
  if (!ownerId) {
    return res.status(400).json({
      code: -1,
      message: '请提供正确的参数'
    })
  }
  try {
    // 获取用户为创建人或者参与者的聊天列表
    let returnRes = [];
    const ownerResult = await Room.find({ ownerId, type: {$eq: 0}, member: {$ne: ownerId } }).select('-creatorId -ownerId -createTime -updatedAt -allMembers') // 自己创建私聊的列表
    const privateChatRes = await Room.find({ member: { $eq: ownerId }, type: { $eq: 0 }, ownerId: { $ne: ownerId } } ).select('-_id -creatorId -ownerId -createTime -updatedAt -allMembers') // 自己是成员的私聊
    const memberResult = await Room.find({ member: {$eq: ownerId }, type: {$eq: 1} } ).select('-creatorId -ownerId -createTime -updatedAt -allMembers') // 群聊列表
    returnRes = ownerResult.concat(memberResult || [])
    returnRes = returnRes.concat(privateChatRes || [])
    res.json({
      code: 0,
      status: 200,
      roomList: returnRes,
    })
  } catch (error) {
    console.log(error)
    res.json({
      code: -1,
      message: '服务器炸了'
    })
  }
})


// 创建聊天列表, 使用循环创建
room.post('/:id', async (req, res, next) => {
  const { id: creatorId = 0 } = req.params
  // console.log(req.body)
  let { members = [], ownerId = 0, title = '', desc = '', type = 0 } = req.body
  if (!creatorId || members.length === 0) {
    return res.status(400).json({
      code: -1,
      message: '请提供正确的参数'
    })
  }
  
  // 如果没有提供聊天室拥有者，那么就默认创建人是聊天室所有者
  if (!ownerId) {
    ownerId = creatorId
  }

  // 如果成员超过1个人，自动升级为群聊
  if (members.length >= 3) {
    type = 1
  }

  let faildCreateList = []
  let successCrateList = []

  // 循环创建聊天列表
  await Promise.all(map(members, async item => {
    const member = item
    try {
      const room = new Room({
        _id: new mongoose.Types.ObjectId(),
        creatorId,
        ownerId,
        title,
        desc,
        member,
        type,
        allMembers: members,
      })
      const result = await room.save()
      successCrateList.push(result)
    } catch (error) {
      faildCreateList.push(member)
    }
  }))

  res.json({
    code: 0,
    status: 'ok',
    faildCreateList,
    successCrateList,
  })
  
})

export default room
