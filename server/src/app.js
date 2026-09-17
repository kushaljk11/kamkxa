const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { isDBConnected } = require('./config/db');

const app = express();

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Resilient CORS configuration
const configuredClientUrls = (process.env.CLIENT_URL || '')
  .split(',')
  .map((url) => url.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://kamkxa.vercel.app',
  ...configuredClientUrls,
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      const cleanOrigin = origin.trim().replace(/\/+$/, '');
      const isAllowed =
        allowedOrigins.some((allowed) => cleanOrigin === allowed) ||
        cleanOrigin.endsWith('.vercel.app') ||
        cleanOrigin.includes('localhost');

      if (isAllowed) {
        // Echo back the exact clean origin so browser matches precisely
        callback(null, cleanOrigin);
      } else {
        console.warn(`[CORS Blocked] Origin "${origin}" not permitted. Allowed:`, allowedOrigins);
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Request body parsers & cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = isDBConnected() ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'ok',
    app: 'GoTaskManager',
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

// Routes
const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');
const projectRoutes = require('./routes/project.routes');
const reminderRoutes = require('./routes/reminder.routes');

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/reminders', reminderRoutes);

// 404 Handler for API routes
app.use('/api', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[GoTaskManager Error]', err);
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

module.exports = app;
