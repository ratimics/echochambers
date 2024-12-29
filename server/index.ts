
import express from 'express';
import cors from 'cors';
import roomsRouter from './api/rooms';
import { initializeStore } from './store';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use('/api/rooms', roomsRouter);

async function start() {
  await initializeStore();
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
  });
}

start().catch(console.error);
