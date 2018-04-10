const AuthController = require('./controllers/authentication');
const UserController = require('./controllers/user');
const ChatController = require('./controllers/chat');
const WorkspaceController = require('./controllers/workspace');

const express = require('express');
const passport = require('passport');

const passportService = require('./config/passport');

// Middleware to require auth
const requireAuth = passport.authenticate('jwt', { session: false });

module.exports = function (app) {
  // Initializing route groups
  const apiRoutes = express.Router(),
    authRoutes = express.Router(),
    userRoutes = express.Router(),
    chatRoutes = express.Router(),
    workspaceRoutes = express.Router();

  //= ========================
  // Auth Routes
  //= ========================

  // Set auth routes as subgroup/middleware to apiRoutes
  apiRoutes.use('/auth', authRoutes);

  // Registration route
  authRoutes.post('/register', AuthController.register);

  // Login route
  authRoutes.post('/login', AuthController.login);

  //= ========================
  // User Routes
  //= ========================

  // Set user routes as a subgroup/middleware to apiRoutes
  apiRoutes.use('/user', userRoutes);

  // View user profile route
  userRoutes.get('/:userId', requireAuth, UserController.viewProfile);

  //= ========================
  // Chat Routes
  //= ========================

  // Set chat routes as a subgroup/middleware to apiRoutes
  apiRoutes.use('/chat', chatRoutes);

  // View messages to and from authenticated user
  chatRoutes.get('/', requireAuth, ChatController.getMessages);

  // Send in conversation
  chatRoutes.post('/send', requireAuth, ChatController.send);

  //= ========================
  // Chat Routes
  //= ========================

  // Set workspace routes as a subgroup/middleware to apiRoutes
  apiRoutes.use('/workspace', workspaceRoutes);

  // View workspaces to and from authenticated user
  workspaceRoutes.get('/', WorkspaceController.getWorkspaces);

  // Create workspace
  workspaceRoutes.post('/create', WorkspaceController.createWorkspace);

  // Get workspace
  workspaceRoutes.post('/get', WorkspaceController.getWorkspace);

  // View workspace
  workspaceRoutes.get('/:workspaceId', WorkspaceController.viewWorkspace);

  // Set url for API group routes
  app.use('/api', apiRoutes);
};
