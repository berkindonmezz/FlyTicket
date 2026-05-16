const db = require('../config/db');

const getAllFlights = async (req, res) => {
    try {
        const query = `
            SELECT 
                f.*, 
                c1.city_name AS from_city_name, 
                c2.city_name AS to_city_name 
            FROM flight f
            JOIN city c1 ON f.from_city = c1.city_id
            JOIN city c2 ON f.to_city = c2.city_id
            ORDER BY f.departure_time ASC
        `;

        const [rows] = await db.query(query);
        
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching flights:', error);
        res.status(500).json({ message: 'Server error, flights could not be loaded.' });
    }
};
const createFlight = async (req, res) => {
    const { from_city, to_city, departure_time, arrival_time, price, seats_total } = req.body;

    try {
        const numPrice = parseFloat(price);
        const numSeats = parseInt(seats_total, 10);

        if (isNaN(numSeats) || numSeats <= 0) {
            return res.status(400).json({ message: "Invalid operation: total seats must be at least 1." });
        }

        if (isNaN(numPrice) || numPrice <= 0) {
            return res.status(400).json({ message: "Invalid operation: flight price must be greater than 0." });
        }

        if (from_city === to_city) {
            return res.status(400).json({ message: "Invalid operation: departure and arrival cities cannot be the same." });
        }

        const [departureConflict] = await db.query(
            "SELECT * FROM flight WHERE from_city = ? AND departure_time = ?", 
            [from_city, departure_time]
        );
        if (departureConflict.length > 0) {
            return res.status(400).json({ message: "Conflict: Another flight departs from this city at the same time." });
        }

        const [arrivalConflict] = await db.query(
            "SELECT * FROM flight WHERE to_city = ? AND arrival_time = ?", 
            [to_city, arrival_time]
        );
        if (arrivalConflict.length > 0) {
            return res.status(400).json({ message: "Conflict: Another flight arrives to this city at the same time." });
        }

        const query = `
            INSERT INTO flight (from_city, to_city, departure_time, arrival_time, price, seats_total, seats_available)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        await db.query(query, [from_city, to_city, departure_time, arrival_time, numPrice, numSeats, numSeats]);

        res.status(201).json({ message: "Flight created successfully." });
    } catch (error) {
        console.error('Error creating flight:', error);
        res.status(500).json({ message: 'Server error, flight could not be created.' });
    }
};
const getFlightPassengers = async (req, res) => {
    const { id } = req.params; 

    try {
        const [passengers] = await db.query(
            "SELECT ticket_id, passenger_name, passenger_surname, passenger_email, seat_number FROM ticket WHERE flight_id = ?",
            [id]
        );

        if (passengers.length === 0) {
            return res.status(200).json({ message: "No tickets have been issued for this flight yet.", data: [] });
        }

        res.status(200).json(passengers);
    } catch (error) {
        console.error('Error fetching passenger list:', error);
        res.status(500).json({ message: 'Server error, passenger list could not be loaded.' });
    }
};

const searchFlights = async (req, res) => {
    const { from, to, date } = req.query;

    try {
        const query = `
            SELECT f.*, 
                   c1.city_name as from_city_name, 
                   c2.city_name as to_city_name 
            FROM flight f
            JOIN city c1 ON f.from_city = c1.city_id
            JOIN city c2 ON f.to_city = c2.city_id
            WHERE f.from_city = ? 
              AND f.to_city = ? 
              AND DATE(f.departure_time) = ?
              AND f.seats_available > 0
        `;

        const [results] = await db.query(query, [from, to, date]);

        res.status(200).json(results);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'An error occurred while searching for flights.' });
    }
};

const getCities = async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM city ORDER BY city_name ASC");
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching cities:', error);
        res.status(500).json({ message: 'Cities could not be retrieved.' });
    }
};

const deleteFlight = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM ticket WHERE flight_id = ?", [id]);

        const [result] = await db.query("DELETE FROM flight WHERE flight_id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Flight not found.' });
        }

        res.status(200).json({ message: "Flight and related tickets deleted successfully." });
    } catch (error) {
        console.error('Error deleting flight:', error);
        res.status(500).json({ message: 'Server error, flight could not be deleted.' });
    }
};

const updateFlight = async (req, res) => {
    const { id } = req.params;
    const { from_city, to_city, departure_time, arrival_time, price, seats_total } = req.body;

    try {
        const query = `
            UPDATE flight 
            SET from_city = ?, to_city = ?, departure_time = ?, arrival_time = ?, price = ?, seats_total = ?
            WHERE flight_id = ?
        `;
        await db.query(query, [from_city, to_city, departure_time, arrival_time, price, seats_total, id]);

        res.status(200).json({ message: "Flight updated successfully." });
    } catch (error) {
        console.error('Error updating flight:', error);
        res.status(500).json({ message: 'Server error, update failed.' });
    }
};

module.exports = {
    getAllFlights,
	createFlight,
	getFlightPassengers,
	searchFlights,
	getCities,
    deleteFlight,
    updateFlight
};