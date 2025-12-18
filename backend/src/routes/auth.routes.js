const { Router } = require('express');
const { register, login, getProfile, logout, getUsers, updateProfile } = require('../controllers/auth.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.route('/profile')
  .get(authMiddleware, getProfile)
  .put(authMiddleware, updateProfile);
router.get('/users', authMiddleware, getUsers);

module.exports = router;
