import mongoose from 'mongoose'

// 用户关系表，即显示在用户关系栏目
const FriendScheme = mongoose.Schema(
  {
    id: mongoose.Schema.Types.ObjectId,

    // 创建者ID
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // 朋友ID
    friend: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    // 创建时间
    createTime: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false,
    timestamps: {
      createdAt: 'createTime'
    }
  }
)

export default mongoose.model('Friend', FriendScheme)
