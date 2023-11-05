import dotenv from 'dotenv';
dotenv.config();

import './db.js';
import app from './app.js';

app.listen(process.env.PORT, () => {
  console.log(`[Server] listening on port ${process.env.PORT}`);
});
