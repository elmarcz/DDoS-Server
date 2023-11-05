import { Schema, model } from 'mongoose';

const attackInfoSchema = new Schema({
    serverID: String,
    url: String,
    times: String,
    time: String,
    hourStart: String,
    hourEnd: String,
    publicIP: String,
    privateIP: String,
    port: String
});

export default model('attackInfoSchema', attackInfoSchema);