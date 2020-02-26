import { Router } from 'express'
import mongoose from 'mongoose'
import Friend from '../../../models/friend'
// import checkAuth from '../../../plugin/check-auth'
const friend = Router()


// 通过用户ID获取好友列表
friend.get('/:id', async (req, res, next) => {
  const { id: owner = 0 } = req.params
  if (!owner) {
    return res.status(400).json({
      code: -1,
      message: '请提供正确的参数'
    })
  }
  try {
    // 通过拥有者ID查询好友列表的资料，使用populate来填充用户信息
    const result = await Friend.find({ $or: [ { owner }, { menber: { $eq: owner } } ] }).populate({path: 'friend', select: 'name email '}).select('friend -_id')
    res.json({
      code: 0,
      status: 200,
      friendsArr: result
    })
  } catch (error) {
    res.json({
      code: -1,
      message: '服务器炸了'
    })
  }
})


// 创建好友关系
friend.post('/:id', async (req, res, next) => {
  const { id: _id = 0 } = req.params
  const { friendId = 0 } = req.body
  if (!_id || !friendId) {
    return res.status(400).json({
      code: -1,
      message: '请提供正确的参数'
    })
  }
  try {
    const friendData = new Friend({
      _id: new mongoose.Types.ObjectId(),
      owner: _id,
      friend: friendId
    })
    const saveRes = await friendData.save()

    res.json({
      code: 0,
      status: 200,
      saveRes: saveRes
    })
  } catch (error) {
    res.json({
      code: -1,
      message: '服务器炸了'
    })
  }
})

export default friend
