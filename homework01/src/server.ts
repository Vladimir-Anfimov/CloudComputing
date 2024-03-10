import { IncomingMessage, RequestListener, Server, ServerResponse } from "http";
import { Endpoint } from "./endpoints/Endpoint";
import dotenv from "dotenv";
import ContactEndpoint from "./endpoints/ContactEndpoint";
import { PrismaClient } from '@prisma/client'
import ResponseApi from "./utils/ResponseUtils";
import MessageEndpoint from "./endpoints/MessageEndpoint";

export const prisma = new PrismaClient()

dotenv.config();

const endpoints: Endpoint[] = [
    new ContactEndpoint("^/api/contacts(/\\d+)?$"), // Matches "/api/contacts", "/api/contacts/", "/api/contacts/{int}"
    new MessageEndpoint("^/api/contacts/\\d+/messages(/\\d+)?$") // Matches "/api/contacts/{int}/messages", "/api/contacts/{int}/messages/", "/api/contacts/{int}/messages/{int}"
];


const requestListener: RequestListener = async (
    request: IncomingMessage,
    response: ServerResponse
) => {
    try {
        const endpoint = endpoints.find((endpoint) => request.url?.match(endpoint.matchingExpression));
        if (endpoint) {
            await endpoint.handle(request, response);
            return;
        }
        else {
            console.log(`Route not found: ${request.url} ${request.method}`);
            ResponseApi.NotImplemented(response);
        }
    } catch (error) {
        console.error(error);
        ResponseApi.InternalServerError(response);
    }

    response.end();
}

const main = async () => {
    const server = new Server(requestListener);
    const port = process.env.PORT || 3000;

    server.listen(port);

    console.log(`Server is listening on port ${port}`);
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect())


