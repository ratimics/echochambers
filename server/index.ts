import express from 'express';
import cors from 'cors';
import roomsRouter from './api/rooms';
import { initializeDatabase } from './db';

const app = express();
const port = process.env.PORT || 3001;
const HOST = '0.0.0.0';

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use('/api/rooms', roomsRouter);

async function start() {
  try {
    await initializeDatabase();
    app.listen(port, HOST, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();