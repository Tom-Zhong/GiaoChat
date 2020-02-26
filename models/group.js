import mongoose from 'mongoose'

// 群组成员表
const RoomsSchema = mongoose.Schema(
  {
    id: mongoose.Schema.Types.ObjectId,                                // 群组ID
    creatorId: {                                                       // 创建者的ID
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],  // 群聊成员
    createTime: {                                                      // 创建时间
      type: Date,
      default: Date.now
    },
  },
  {
    versionKey: false,
    timestamps: {
      createdAt: 'createTime',
    }
  }
)

export default mongoose.model('Rooms', RoomsSchema)
