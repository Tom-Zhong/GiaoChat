import mongoose from 'mongoose'

const ArticleSchema = mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    desc: { type: String },
    content: { type: String, required: true },
    mdContent: { type: String },
    parseContent: { type: String },
    type: { type: String },
    tags: [{ type: String }],
    fans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: { type: mongoose.Schema.Types.ObjectId, ref: 'Comments' },
    createTime: {
        type: Date,
        default: Date.now
    },
    updateTime: {
        type: Date,
        default: Date.now
    }
},
    {
        versionKey: false,
        timestamps: {
            createdAt: 'createTime', updatedAt: 'updateTime'
        }
    })

export default mongoose.model('Article', ArticleSchema)