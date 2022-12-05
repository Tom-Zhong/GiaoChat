 import mongoose from 'mongoose'

// 聊天信息表，即每一条聊天记录
const MessageScheme = mongoose.Schema(
  {
    id: mongoose.Schema.Types.ObjectId,                                // 消息ID
    creatorId: {                                                       // 创建者的ID
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: { type: String, required: true },                         // 消息内容
    from: {                                                            // 发送者的ID
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    to: [
      {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
      }
    ],
    roomsId: {                                                         // 房间ID
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rooms',
      required: true
    },
    unReadMessageMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],  // 没有阅读信息的成员
    // readStatus: { type: Number, default: 0 },                          // 阅读标识，0代表未读、1代表已读
    type:  { type: Number, default: 0 },                               // 消息类型，0代表普通的文本信息
    createTime: {
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

export default mongoose.model('Message', MessageScheme)
