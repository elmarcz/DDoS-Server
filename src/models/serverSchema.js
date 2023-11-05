import { Schema, model } from 'mongoose'

const serverSchema = new Schema({
    serverName: String,
    Url: String,
    Location: String,
    isAttacking: {
        type: Boolean,
        default: false
    },
    Date: {
        type: Date,
        default: Date.now()
    }
});

export default model('serverSchema', serverSchema);