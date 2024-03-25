import express from 'express';
import dotenv from 'dotenv';
import zod from 'zod';
import { sendMail } from './mail';
import { MailError } from './exceptions/MailError';

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use((req, res, next) => {
    const apiKey = req.header('X-API-Key');
    if (apiKey === process.env.API_KEY) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});

app.post('/api/send-mail', async (req, res) => {
    const mailDataSchema = zod.object({
        to: zod.string().email(),
        subject: zod.string().min(1).max(50),
        text: zod.string().min(1).max(1000),
    });

    try {
        const mailData = mailDataSchema.parse(req.body);
        sendMail(mailData);
        res.status(200).json({ message: 'Email sent successfully' });
    }
    catch (error) {
        if (error instanceof zod.ZodError) {
            console.error('Validation error:', error);
            res.status(400).json({ message: 'Invalid data' });
        }
        else if (error instanceof MailError) {
            console.error('Mail error:', error);
            res.status(500).json({ message: 'Error sending email' });
        }
        else {
            console.error('Unknown error:', error);
            res.status(500).json({ message: 'Unknown error' });
        }
    }
});


app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});