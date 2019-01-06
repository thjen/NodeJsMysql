var express = require('express');
var router = express.Router();
const authController = require('../src/controllers/Auth/Auth.controller');
const authMiddleware = require('../src/middlewares/Auth/AuthInput.middleware');
/* GET users listing. */
router.post('/register', authMiddleware.validateRegister, authController.register);
router.post('/login', authController.login);
router.get('/me', authMiddleware.verifyToken, authController.me);
router.put('/reset-password', authMiddleware.validateResetPassword, authController.resetPassword);
router.put('/change-password', authMiddleware.validateChangePassword, authController.changePassword);
router.get('/logout', (req,res) => {
  res.send('Log out');
});

module.exports = router;
