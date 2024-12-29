import express from 'express';
import cors from 'cors';
import roomsRouter from './api/rooms';
import { initializeStore } from './store';

const app = express();
const port = 3001;
const host = '0.0.0.0';

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use('/api/rooms', roomsRouter);

async function start() {
  await initializeStore();
  app.listen(port, host, () => {
    console.log(`Server running on ${host}:${port}`);
  });
}

start().catch(console.error);