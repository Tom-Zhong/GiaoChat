import mongoose from 'mongoose'

// 用户表
const UserSchema = mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    name: String,
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match:/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    pwd: { type: String, required: true },
    role: { type: Number, default: 0 },
    age: Number,
    onLineStatus: { type: Number, default: 0 }, // 用户是否在线、0表示离线，用户登陆以后改变这个表，后期可能会改成redis来处理
}, { versionKey: false })

export default mongoose.model('User', UserSchema)