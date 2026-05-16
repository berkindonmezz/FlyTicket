const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const auth = require('../middleware/auth');

router.post('/', ticketController.buyTicket);
router.get('/all', auth, ticketController.getAllTickets);

module.exports = router;