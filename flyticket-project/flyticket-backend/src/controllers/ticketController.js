const db = require('../config/db');
const nodemailer = require('nodemailer');

const buyTicket = async (req, res) => {
    const { flight_id, passenger_name, passenger_surname, passenger_email } = req.body;

    try {
        const [flights] = await db.query("SELECT departure_time, seats_available, seats_total FROM flight WHERE flight_id = ?", [flight_id]);
        
        if (flights.length === 0) {
            return res.status(404).json({ message: "Flight not found!" });
        }

        if (flights[0].seats_available <= 0) {
            return res.status(400).json({ message: "Sorry, no seats available on this flight!" });
        }

        const [soldTickets] = await db.query("SELECT COUNT(*) as total_sold FROM ticket WHERE flight_id = ?", [flight_id]);
        const nextSeatNumber = (soldTickets[0].total_sold + 1).toString();

        const ticketQuery = `
            INSERT INTO ticket (flight_id, passenger_name, passenger_surname, passenger_email, seat_number) 
            VALUES (?, ?, ?, ?, ?)
        `;
        const [ticketResult] = await db.query(ticketQuery, [flight_id, passenger_name, passenger_surname, passenger_email, nextSeatNumber]);

        const updateFlightQuery = `
            UPDATE flight 
            SET seats_available = seats_available - 1 
            WHERE flight_id = ?
        `;
        await db.query(updateFlightQuery, [flight_id]);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const [cityData] = await db.query(`
            SELECT c1.city_name as from_city, c2.city_name as to_city 
            FROM flight f
            JOIN city c1 ON f.from_city = c1.city_id
            JOIN city c2 ON f.to_city = c2.city_id
            WHERE f.flight_id = ?
        `, [flight_id]);

        const fromCityName = cityData[0]?.from_city || 'Unknown';
        const toCityName = cityData[0]?.to_city || 'Unknown';

        const mailOptions = {
            from: `"FlyTicket System" <${process.env.EMAIL_USER}>`,
            to: passenger_email,
            subject: 'Reservation Confirmed - FlyTicket',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #2563eb;">FlyTicket Ticket Confirmation</h2>
                    <p>Dear <b>${passenger_name} ${passenger_surname}</b>,</p>
                    <p>Your flight reservation has been successfully completed. Your ticket details are below:</p>
                    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p><b>PNR/Ticket No:</b> #${ticketResult.insertId}</p>
                        <p><b>Seat No:</b> ${nextSeatNumber}</p>
                        <p><b>Route:</b> ${fromCityName} ➔ ${toCityName}</p>
                        <p><b>Departure Time:</b> ${new Date(flights[0].departure_time).toLocaleString('en-US')}</p>
                    </div>
                    <p>Have a pleasant flight!</p>
                </div>
            `
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) console.error("Mail send error:", error);
            else console.log("E-ticket sent successfully: " + info.response);
        });

        res.status(201).json({ 
            message: "Ticket purchased successfully! Have a pleasant flight.",
            seat_assigned: nextSeatNumber 
        });

    } catch (error) {
        console.error("Ticket purchase error:", error);
        res.status(500).json({ message: "Server error, ticket could not be created." });
    }
};

const getAllTickets = async (req, res) => {
    try {
        const query = `
            SELECT t.*, f.departure_time, c1.city_name as from_city, c2.city_name as to_city
            FROM ticket t
            JOIN flight f ON t.flight_id = f.flight_id
            JOIN city c1 ON f.from_city = c1.city_id
            JOIN city c2 ON f.to_city = c2.city_id
            ORDER BY f.departure_time DESC
        `;
        const [rows] = await db.query(query);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching tickets:", error);
        res.status(500).json({ message: "Ticket list could not be loaded." });
    }
};

module.exports = { buyTicket, getAllTickets };