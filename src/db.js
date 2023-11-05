import mongoose from 'mongoose'
import dotenv from 'dotenv';
dotenv.config()

mongoose.connect(process.env.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(console.log('[DB] Server has connected with db'))
    .catch((err) => console.log(`[DB] An error has occurred: ${err}`))