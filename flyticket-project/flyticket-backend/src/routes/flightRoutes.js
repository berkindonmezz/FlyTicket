const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');
const auth = require('../middleware/auth');

router.get('/', flightController.getAllFlights);
router.get('/:id/passengers', auth, flightController.getFlightPassengers);
router.get('/search', flightController.searchFlights);
router.get('/cities', flightController.getCities);
router.post('/', auth, flightController.createFlight);

router.delete('/:id', auth, flightController.deleteFlight);
router.put('/:id', auth, flightController.updateFlight);

module.exports = router;