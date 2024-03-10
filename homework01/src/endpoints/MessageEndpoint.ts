import { IncomingMessage, ServerResponse } from "http";
import ResponseApi from "../utils/ResponseUtils";
import { ExtractContactId, ExtractMessageId } from "../utils/ExtractIdentifier";
import { prisma } from "../server";
import { requestBodyHelper } from "../utils/HttpUtils";
import { UpsertMessageDto } from "../dtos";
import { Endpoint } from "./Endpoint";

class MessageEndpoint extends Endpoint {
    public static readonly ROUTES = [
        { method: "GET", path: "/contacts/\\d+/messages", handler: MessageEndpoint.getMessages },
        { method: "GET", path: "/contacts/\\d+/messages/\\d+", handler: MessageEndpoint.getMessageById },
        { method: "POST", path: "/contacts/\\d+/messages", handler: MessageEndpoint.createMessage },
        { method: "DELETE", path: "/contacts/\\d+/messages/\\d+", handler: MessageEndpoint.deleteMessage },
        { method: "PUT", path: "/contacts/\\d+/messages/\\d+", handler: MessageEndpoint.updateMessage }
    ]

    constructor(public matchingExpression: string) {
        super(matchingExpression);
    }

    handle(request: IncomingMessage, response: ServerResponse): Promise<void> {
        for (const route of MessageEndpoint.ROUTES) {
            if (request.url?.match(route.path) && request.method === route.method) {
                return route.handler(request, response);
            }
        }

        return Promise.resolve(ResponseApi.NotFound(response, { error: "Route not found" }));
    }

    private static async getMessages(request: IncomingMessage, response: ServerResponse) {
        const contactId = request.url ? ExtractContactId.fromUrl(request.url) : null;
        if (!contactId) {
            return ResponseApi.BadRequest(response, { error: "Invalid contact id" });
        }

        const messages = await prisma.message.findMany({
            where: {
                contactId: contactId
            }
        });

        return ResponseApi.Ok(response, messages);
    }

    private static async getMessageById(request: IncomingMessage, response: ServerResponse) {
        const contactId = request.url ? ExtractContactId.fromUrl(request.url) : null;
        const messageId = request.url ? ExtractMessageId.fromUrl(request.url) : null;

        if (!contactId || !messageId) {
            return ResponseApi.BadRequest(response, { error: "Invalid contact or message id" });
        }

        const message = await prisma.message.findFirst({
            where: {
                id: messageId,
                contactId: contactId
            }
        });

        if (!message) {
            return ResponseApi.NotFound(response, { error: "Message not found" });
        }

        return ResponseApi.Ok(response, message);
    }

    private static async createMessage(request: IncomingMessage, response: ServerResponse) {
        const contactId = request.url ? ExtractContactId.fromUrl(request.url) : null;
        if (!contactId) {
            return ResponseApi.BadRequest(response, { error: "Invalid contact id" });
        }

        const message = await requestBodyHelper.getJsonBody(request);

        if (!UpsertMessageDto.isValid(message)) {
            return ResponseApi.BadRequest(response, { error: "Invalid message format" });
        }

        const newMessage = await prisma.message.create({
            data: {
                ...message,
                contactId: contactId
            }
        });

        return ResponseApi.Created(response, newMessage);
    }


    private static async deleteMessage(request: IncomingMessage, response: ServerResponse) {
        const contactId = request.url ? ExtractContactId.fromUrl(request.url) : null;
        const messageId = request.url ? ExtractMessageId.fromUrl(request.url) : null;

        if (!contactId || !messageId) {
            return ResponseApi.BadRequest(response, { error: "Invalid contact or message id" });
        }

        await prisma.message.delete({
            where: {
                id: messageId,
                contactId: contactId
            }
        });

        return ResponseApi.NoContent(response);
    }


    private static async updateMessage(request: IncomingMessage, response: ServerResponse) {
        const contactId = request.url ? ExtractContactId.fromUrl(request.url) : null;
        const messageId = request.url ? ExtractMessageId.fromUrl(request.url) : null;

        if (!contactId || !messageId) {
            return ResponseApi.BadRequest(response, { error: "Invalid contact or message id" });
        }

        const message = await requestBodyHelper.getJsonBody(request);

        if (!UpsertMessageDto.isValid(message)) {
            return ResponseApi.BadRequest(response, { error: "Invalid message format" });
        }

        const existingMessage = await prisma.message.findFirst({
            where: {
                id: messageId,
                contactId: contactId
            }
        });

        if (!existingMessage) {
            return ResponseApi.NotFound(response, { error: "Message not found" });
        }

        const updatedMessage = await prisma.message.update({
            where: {
                id: messageId
            },
            data: message
        });

        return ResponseApi.Ok(response, updatedMessage);
    }
}

export default MessageEndpoint;
