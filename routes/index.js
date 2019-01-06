var express = require('express');
var router = express.Router();
const taskController = require('../src/controllers/Task/Task.controller');
const authMiddleware = require('../src/middlewares/Auth/AuthInput.middleware');
/* GET home page. */
router.post('/insert', authMiddleware.verifyToken, taskController.insertTask);
router.put('/update', authMiddleware.verifyToken, taskController.updateTask);
router.get('/delete', authMiddleware.verifyToken, taskController.deleteTask);
router.get('/fetch', authMiddleware.verifyToken, taskController.fetchTask);
router.get('/gettask', authMiddleware.verifyToken, taskController.getTask);

module.exports = router;
