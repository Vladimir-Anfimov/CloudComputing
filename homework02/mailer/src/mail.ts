import { createTransport } from 'nodemailer';
import dotenv from 'dotenv';
import { MailError } from './exceptions/MailError';

dotenv.config();

const transporter = createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT)
});

interface MailData {
    to: string;
    subject: string;
    text: string;
}

export const sendMail = async (mailData: MailData) => {
    const mailOptions = {
        from: process.env.MAIL_FROM,
        ...mailData,
    };

    try {
        const response = await transporter.sendMail(mailOptions);
        console.log('Email sent:', mailOptions, response);
    }
    catch (error) {
        console.error('Error sending email:', error);
        throw new MailError(`Error sending email to ${mailData.to}`);
    }
}