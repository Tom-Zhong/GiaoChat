import { Router } from 'express'
import mongoose from 'mongoose'
import Friend from '../../../models/friend'
import User from '../../../models/user'
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
    const resultAsOwner = await Friend.find({ owner }).populate([ { path: 'friend', select: 'name email onLineStatus', populate: { path: 'friend' }} ]).select('-owner -_id -updatedAt -createTime')
    const resultAsFriend = await Friend.find({ friend: owner }).populate([ { path: 'owner', select: 'name email onLineStatus'} ]).select('-friend -_id -updatedAt -createTime')
    res.json({
      code: 0,
      status: 200,
      friendsList: resultAsOwner.concat(resultAsFriend)
    })
  } catch (error) {
    res.json({
      code: -1,
      message: '服务器炸了'
    })
  }
})

// 获取全部的friends列表
friend.get('/', async (req, res, next) => {
  try {
    // 通过拥有者ID查询好友列表的资料，使用populate来填充用户信息
    const result = await Friend.find().populate('owner friend').select('')
    res.json({
      code: 0,
      status: 200,
      friendsList: result
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
  console.log(req.body);
  const { friendId = 0, friendData = '' } = req.body
  let found_id = 0
  if (!_id || (!friendId && !friendData) ) {
    return res.status(400).json({
      code: -4,
      message: '请提供合理的请求参数'
    })
  }

  if (friendData) {
    const result = await User.findOne({
      $or: [
        {name: friendData},
        {email: friendData},
      ]
    })
    if (result) {
      found_id = result._id
    }
  }

  if (found_id === _id) {
    return res.status(403).json({
      code: -2,
      msg: '不能添加自己为好友'
    })
  }

  try {
    const checkRelationship = await Friend.findOne({ owner: _id, friend: found_id || friendId })
    if (checkRelationship) {
      res.json({
        code: -1,
        msg: '朋友关系已建立'
      })
    } else {
      const friendData = new Friend({
        _id: new mongoose.Types.ObjectId(),
        owner: _id,
        friend: found_id || friendId
      })
      const saveRes = await friendData.save()

      res.json({
        code: 0,
        status: 200,
        saveRes: saveRes,
        msg: '成功建立好友关系'
      })
    }
  } catch (error) {
    res.json({
      code: 3,
      msg: '请提供合理的请求参数或者服务器未能响应你的需求'
    })
  }
})

export default friend
