import mongoose from 'mongoose'

// 房间表，即聊天记录列表
const RoomsSchema = mongoose.Schema(
  {
    id: mongoose.Schema.Types.ObjectId,                                // 房间ID
    creatorId: {                                                       // 创建者的ID
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    ownerId: {                                                         // 房间所有人
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: { type: String, required: true },                           // 房间名称
    desc: { type: String },                                            // 房间描述
    type: { type: Number, required: true, default: 0 },                // 房间类型， 0代表两人聊天房间, 1代表群聊房间
    allMembers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    ], // 全部房间成员
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
