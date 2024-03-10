import { IncomingMessage } from "http";


export class requestBodyHelper {
    static async getBody(req: IncomingMessage): Promise<string> {
        let body = '';

        for await (const chunk of req) {
            body += chunk.toString();
        }

        return body;
    }

    static async getJsonBody(request: IncomingMessage): Promise<any> {
        const body = await this.getBody(request);

        if (!body || body.length === 0) {
            return null;
        }

        const json = JSON.parse(body);
        return json;
    }
}