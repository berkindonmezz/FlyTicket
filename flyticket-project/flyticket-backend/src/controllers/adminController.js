const bcrypt = require('bcrypt');
const db = require('../config/db');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const [admin] = await db.query("SELECT * FROM admin WHERE username = ?", [username]);

        if (admin.length === 0) {
            return res.status(401).json({ message: "Invalid username or password." });
        }

        const isPasswordValid = await bcrypt.compare(password, admin[0].password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid username or password." });
        }

        const token = jwt.sign(
            { admin_id: admin[0].admin_id, username: admin[0].username },
            process.env.JWT_SECRET || 'gizli_anahtar',
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Server error." });
    }
};

module.exports = { login };