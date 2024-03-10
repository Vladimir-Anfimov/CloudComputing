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
                return Result.Fail(["No body"]);
            }

            const json = JSON.parse(body);
            return Result.Success(json);
        }
        catch (error) {
            return Result.Fail(["Invalid JSON body"]);
        }
    }
}