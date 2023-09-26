const express = require('express')
const { createChat, findChat, userChats } = require('../controllers/Chat-And-Messages/chatController');
const router = express.Router()

router.post('/chat/', createChat);
router.get('/chat/:userId', userChats);
router.get('/chat/find/:firstId/:secondId', findChat);

module.exports=  router