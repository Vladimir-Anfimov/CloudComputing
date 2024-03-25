import { IncomingMessage, ServerResponse } from "http";

const CATCH_ALL = ".*";

export abstract class Endpoint {
    constructor(
        public matchingExpression: string = CATCH_ALL, 
    ) {}

    abstract handle(request: IncomingMessage, response: ServerResponse): Promise<void>;
}