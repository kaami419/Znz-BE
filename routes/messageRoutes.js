const express= require('express') ;
const { addMessage, getMessages } = require('../controllers/Chat-And-Messages/messageController');

const router = express.Router();

router.post('/message/', addMessage);

router.get('/message/:chatId', getMessages);

module.exports = router