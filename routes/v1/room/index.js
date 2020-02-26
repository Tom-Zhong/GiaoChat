import { Router } from 'express'
import mongoose from 'mongoose'
import Room from '../../../models/rooms'
// import checkAuth from '../../../plugin/check-auth'
const room = Router()
import { map } from 'lodash'

// 通过用户ID获取房间列表
room.get('/:id', async (req, res, next) => {
  const { id: member = 0 } = req.params
  if (!member) {
    return res.status(400).json({
      code: -1,
      message: '请提供正确的参数'
    })
  }
  try {
    // 通过拥有者ID查询好友列表的资料，使用populate来填充用户信息
    const result = await Room.find({ member })
    res.json({
      code: 0,
      status: 200,
      roomsArr: result
    })
  } catch (error) {
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
        type
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
