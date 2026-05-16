const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');
const flightRoutes = require('./routes/flightRoutes');
const adminRoutes = require('./routes/adminRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/test-db', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT "Connection successful!" as message');
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Database connection error!", detail: err.message });
    }
});
app.use('/api/flights', flightRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/tickets', ticketRoutes);

const PORT = process.env.PORT || 5000;

db.query('SELECT 1')
    .then(() => {
        console.log('Database connection successful.');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}...`);
        });
    })
    .catch((err) => {
        console.error('Database connection error:', err.message);
        process.exit(1);
    });
