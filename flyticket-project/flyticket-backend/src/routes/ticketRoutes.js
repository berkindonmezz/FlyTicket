const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const auth = require('../middleware/auth');
const { getBookedSeats } = require('../controllers/ticketController');

router.post('/', ticketController.buyTicket);
router.get('/all', auth, ticketController.getAllTickets);
router.get('/flight/:id/seats', getBookedSeats);

module.exports = router;