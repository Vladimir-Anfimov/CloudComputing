import * as formidable from 'formidable';
import { IncomingMessage } from "http";
import Result from "./Result";


export class requestBodyHelper {
    static async getBody(req: IncomingMessage): Promise<string> {
        let body = '';

        for await (const chunk of req) {
            body += chunk.toString();
        }

        return body;
    }

    static async getJsonBody(request: IncomingMessage): Promise<Result> {
        try {
            const body = await this.getBody(request);

            if (!body || body.length === 0) {
                return Result.Fail("No body");
            }

            const json = JSON.parse(body);
            return Result.Success(json);
        }
        catch (error) {
            return Result.Fail("Invalid JSON body");
        }
    }
}


export class RequestMultiPartData {
    static async getFormData(req: IncomingMessage): Promise<any> {
        return new Promise((resolve, reject) => {
            const form = new formidable.IncomingForm();

            form.parse(req, (err, fields, files) => {
                if (err) {
                    console.error('Error parsing form data:', err);
                    reject(err);
                } else {
                    resolve({ fields, files });
                }
            });
        });
    }
}