require('dotenv').config();
const express = require('express');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const connectDB = require('./config/db');
const configurePassport = require('./config/passport');
const sessionRoutes = require('./routes/sessions');
const swipeRoutes = require('./routes/swipes');
const titleRoutes = require('./routes/titles');
const userRoutes = require('./routes/users');
const auth = require('./middleware/auth');
const webAuth = require('./middleware/webAuth');

const app = express();

const isGoogleOAuthEnabled = configurePassport();

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BingeMatch API',
      version: '1.0.0',
      description: 'API documentation for BingeMatch, a movie-swiping group picker.',
    },
    servers: [
      {
        url: process.env.API_BASE_URL || '/',
        description: 'Current server base URL',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    tags: [
      { name: 'Sessions', description: 'Session related endpoints' },
      { name: 'Swipes', description: 'Swipe and match endpoints' },
      { name: 'Titles', description: 'Title lookup endpoints' },
      { name: 'Users', description: 'User collection endpoints' },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);
app.use(
  '/api-docs',
  webAuth,
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpecs, {
    swaggerOptions: {
      requestInterceptor: (request) => {
        request.credentials = 'include';
        return request;
      },
    },
  })
);

// Middleware
app.use(express.json());
app.use(passport.initialize());

/**
 * @openapi
 * /sessions/{id}:
 *   get:
 *     summary: Fetch session details by id
 *     tags:
 *       - Sessions
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Session details returned
 */

/**
 * @openapi
 * /swipes/matches/{sessionId}:
 *   get:
 *     summary: Get current matches for a session
 *     tags:
 *       - Swipes
 *     parameters:
 *       - name: sessionId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Match results returned
 */

// Route mounts
app.use('/sessions', sessionRoutes);
app.use('/swipes', swipeRoutes);
app.use('/titles', titleRoutes);
app.use('/users', userRoutes);

// Landing page
const landingPageHTML = require('./public/landingPage');
app.get('/', (req, res) => {
  res.send(landingPageHTML);
});

// Login page
const loginPageHTML = require('./public/loginPage');
app.get('/login', (req, res) => {
  res.send(loginPageHTML);
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;

async function startServer() {
  await connectDB();
  return new Promise((resolve, reject) => {
    const server = app.listen(PORT, () => {
      console.log(`BingeMatch server listening on port ${PORT}`);
      resolve(server);
    });
    server.on('error', (err) => reject(err));
  });
}

if (require.main === module) {
  startServer().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
}

module.exports = { app, startServer };