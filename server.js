require('dotenv').config();
const express = require('express');
const passport = require('passport');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const connectDB = require('./config/db');
const configurePassport = require('./config/passport');
const authRoutes = require('./routes/auth');
const sessionRoutes = require('./routes/sessions');
const swipeRoutes = require('./routes/swipes');
const titleRoutes = require('./routes/titles');
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
  },
  apis: ['./routes/*.js'],
};

const swaggerSpecs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', webAuth, swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Middleware
app.use(express.json());
app.use(passport.initialize());

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 */

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
app.use('/auth', authRoutes);
app.use('/sessions', sessionRoutes);
app.use('/swipes', swipeRoutes);
app.use('/titles', titleRoutes);

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
  app.listen(PORT, () => {
    console.log(`BingeMatch server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

module.exports = app;
