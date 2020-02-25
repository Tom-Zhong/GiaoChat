import mongoose from 'mongoose'

// 用户关系表，即显示在用户关系栏目
const UserSchema = mongoose.Schema(
  {
    id: mongoose.Schema.Types.ObjectId,

    // 创建者ID
    OwnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    // 朋友ID
    friendsId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    // 朋友名称
    friendsName: {
      type: String, required: true
    },
    
    // 朋友邮箱
    friendsEmail: {
      type: String, required: true
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

export default mongoose.model('User', UserSchema)
