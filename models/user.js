import mongoose from 'mongoose'

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
    age: Number
}, { versionKey: false })

export default mongoose.model('User', UserSchema)