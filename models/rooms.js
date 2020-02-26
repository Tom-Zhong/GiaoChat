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
    member: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },     // 房间成员，创建房间时，会为所有拥有这个聊天房间的人都创建，举个例子，有房间有10个成员，就会创建10个房间聊天记录表
    unReadMessageCount: { type: Number, required: true, default: 0 },  // 没有阅读的信息量
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
