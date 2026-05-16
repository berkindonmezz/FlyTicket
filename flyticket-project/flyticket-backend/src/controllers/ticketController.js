const db = require('../config/db');
const nodemailer = require('nodemailer');

const buyTicket = async (req, res) => {
    // 1. seat_number verisini React'ten karşılıyoruz
    const { flight_id, passenger_name, passenger_surname, passenger_email, seat_number } = req.body;

    // Güvenlik kontrolü: Koltuk numarası gelmediyse işlemi reddet
    if (!seat_number) {
        return res.status(400).json({ message: "Seat number is required!" });
    }

    try {
        const [flights] = await db.query("SELECT departure_time, seats_available, seats_total FROM flight WHERE flight_id = ?", [flight_id]);
        
        if (flights.length === 0) {
            return res.status(404).json({ message: "Flight not found!" });
        }

        if (flights[0].seats_available <= 0) {
            return res.status(400).json({ message: "Sorry, no seats available on this flight!" });
        }

        // ESKİ MANUEL KOLTUK HESAPLAMA SİLİNDİ

        const ticketQuery = `
            INSERT INTO ticket (flight_id, passenger_name, passenger_surname, passenger_email, seat_number) 
            VALUES (?, ?, ?, ?, ?)
        `;
        
        // nextSeatNumber yerine doğrudan seat_number'ı veritabanına yazdırıyoruz
        const [ticketResult] = await db.query(ticketQuery, [flight_id, passenger_name, passenger_surname, passenger_email, seat_number]);

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
                        <p><b>Seat No:</b> ${seat_number}</p>
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
            seat_assigned: seat_number 
        });

    } catch (error) {
        console.error("Ticket purchase error:", error);
        
        // Eşzamanlılık Kontrolü: Eğer aynı uçuşa aynı koltuk tekrar satılmaya çalışılırsa MySQL ER_DUP_ENTRY hatası verir.
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: "Seçilen koltuk az önce satıldı, lütfen başka bir koltuk seçin." });
        }

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

const getBookedSeats = async (req, res) => {
    const flightId = req.params.id;

    try {
        const [rows] = await db.execute(
            'SELECT seat_number FROM ticket WHERE flight_id = ?',
            [flightId]
        );

        const bookedSeats = rows.map(row => row.seat_number);

        res.status(200).json(bookedSeats);
    } catch (error) {
        console.error("Error while fetching booked/occupied seats:", error);
        res.status(500).json({ message: "Server error fetching seats." });
    }
};

module.exports = { buyTicket, getAllTickets, getBookedSeats };