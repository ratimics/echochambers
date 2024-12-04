import { initializeStore } from "./store";
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import roomsRouter from './api/rooms';
import pluginsRouter from './api/plugins';
import { EchoChamberPluginManager } from './plugins/manager';
import { internalPlugins } from './plugins/gnon';

const roomsApp = express();
const pluginsApp = express();
const ROOMS_PORT = Number(process.env.ROOMS_PORT) || 3333;
const PLUGINS_PORT = Number(process.env.PLUGINS_PORT) || 4444;

// Configure CORS for both apps
const corsConfig = {
  origin: '*',  // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204
};

roomsApp.use(cors(corsConfig));
pluginsApp.use(cors(corsConfig));

// Handle preflight requests
roomsApp.options('*', cors(corsConfig));
pluginsApp.options('*', cors(corsConfig));

roomsApp.use(express.json());
pluginsApp.use(express.json());

// Initialize plugin manager
const pluginManager = EchoChamberPluginManager.getInstance();

// Mount the routers on separate apps
roomsApp.use('/api/rooms', roomsRouter);
pluginsApp.use('/api/plugins', pluginsRouter);

// Plugin error handling middleware for plugins app
pluginsApp.use((error: any, req: Request, res: Response, next: NextFunction) => {
  if (error.name === 'PluginError') {
    console.error('Plugin error:', error);
    return res.status(400).json({ 
      error: 'Plugin error', 
      message: error.message 
    });
  }
  next(error);
});

// Add catch-all route handlers for both apps
roomsApp.use((req: Request, res: Response, _next: NextFunction) => {
  console.log('404 Not Found:', req.method, req.url);
  res.status(404).json({ error: `Route not found: ${req.method} ${req.url}` });
});

pluginsApp.use((req: Request, res: Response, _next: NextFunction) => {
  console.log('404 Not Found:', req.method, req.url);
  res.status(404).json({ error: `Route not found: ${req.method} ${req.url}` });
});

async function startServer() {
  try {
    // Initialize store
    await initializeStore();
    
    // Initialize internal plugins
    try {
      for (const plugin of internalPlugins) {
        await pluginManager.registerPlugin(plugin);
        console.log(`Internal plugin ${plugin.metadata.id} registered`);
      }
      console.log('Internal plugins initialized');
    } catch (error) {
      console.error('Warning: Failed to initialize internal plugins:', error);
      // Continue server startup even if plugin initialization fails
    }
    
    roomsApp.listen(ROOMS_PORT, '127.0.0.1', () => {
      console.log(`Rooms server running on port ${ROOMS_PORT}`);
      console.log(`Rooms API available at http://127.0.0.1:${ROOMS_PORT}/api/rooms`);
    });

    pluginsApp.listen(PLUGINS_PORT, '127.0.0.1', () => {
      console.log(`Plugins server running on port ${PLUGINS_PORT}`);
      console.log(`Plugin API available at http://127.0.0.1:${PLUGINS_PORT}/api/plugins`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  try {
    // Cleanup plugins
    const plugins = Array.from(pluginManager.getPlugins().values());
    await Promise.all(plugins.map(plugin => plugin.terminate()));
    console.log('All plugins terminated');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

startServer().catch(console.error);
