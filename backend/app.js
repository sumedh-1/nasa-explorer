process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());

// Detailed CORS config and logging
// Configurable CORS origins from .env (comma-separated)
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3001').split(',').map(o => o.trim());

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow non-browser requests
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};
app.use((req, res, next) => {
  console.log(`[CORS] ${req.method} ${req.originalUrl} from ${req.headers.origin}`);
  next();
});
app.use(cors(corsOptions));

// Log CORS errors
app.use((err, req, res, next) => {
  if (err && err instanceof Error && err.message.includes('CORS')) {
    console.error('[CORS ERROR]', err);
  }
  next(err);
});
const port = 3000;

// Import NASA routes
const nasaRoutes = require('./routes/nasa');
const aiRoutes = require('./routes/ai');
const userRoutes = require('./routes/user');

// Root route
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

// Use NASA API routes
app.use('/api/nasa', nasaRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/user', userRoutes);

app.listen(port, () => {
  console.log(`Express app listening at http://localhost:${port}`);
});
