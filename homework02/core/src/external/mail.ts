import dotenv from 'dotenv';
import Result from '../utils/Result';

dotenv.config();

export const sendMail = async (mailText: string): Promise<Result> => {
    try {
        const response = await fetch(`${process.env.MAIL_API_URL}/send-mail`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': process.env.MAIL_API_KEY
            } as HeadersInit,
            body: JSON.stringify({
                to: "admin@example.com",
                subject: "New modification in CRM",
                text: mailText
            })
        });

        if (response.status === 200) {
            return Result.Success();
        } else {
            return Result.Fail('Error sending mail');
        }
    }
    catch (error) {
        console.error('Error sending mail:', error);
        return Result.Fail('Error sending mail');
    }
}


