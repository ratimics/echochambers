
import express, { Request, Response, NextFunction } from 'express';
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

// Basic health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/rooms', roomsRouter);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error', success: false });
});

async function start() {
  try {
    await initializeStore();
    app.listen(port, host, () => {
      console.log(`Server running on ${host}:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start().catch(console.error);
