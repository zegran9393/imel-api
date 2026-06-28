const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY || 'GANTI_DI_RENDER';

app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});

app.post('/api/send', async (req, res) => {
    try {
        const { apiKey, userEmail, userPass, toEmail, subject, htmlBody } = req.body;

        if (apiKey !== API_KEY) {
            return res.status(401).json({ success: false, error: 'Invalid API Key' });
        }

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: { user: userEmail, pass: userPass }
        });

        const info = await transporter.sendMail({
            from: `"WhatsApp Support" <${userEmail}>`,
            to: toEmail,
            subject: subject,
            html: htmlBody
        });

        res.json({ success: true, messageId: info.messageId });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(3000, () => console.log('API running on port 3000'));
