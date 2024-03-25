import { IncomingMessage, ServerResponse } from "http";
import ResponseApi from "../utils/ResponseUtils";
import { ExtractContactId, ExtractMessageId } from "../utils/ExtractIdentifier";
import { prisma } from "../server";
import { RequestMultiPartData, requestBodyHelper } from "../utils/HttpUtils";
import { UpsertMessageDto } from "../dtos";
import { Endpoint } from "./Endpoint";
import { getObject, storeObject } from "../external/storage";

class MessageEndpoint extends Endpoint {
    public static readonly ROUTES = [
        { method: "GET", path: "/contacts/\\w+/messages/\\w+", handler: MessageEndpoint.getMessageById },
        { method: "GET", path: "/contacts/\\w+/messages", handler: MessageEndpoint.getMessages },
        { method: "POST", path: "/contacts/\\w+/messages", handler: MessageEndpoint.createMessage },
        { method: "DELETE", path: "/contacts/\\w+/messages/\\w+", handler: MessageEndpoint.deleteMessage },
        { method: "PUT", path: "/contacts/\\w+/messages/\\w+", handler: MessageEndpoint.updateMessage }
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

        const messagesWithFiles: any[] = [...messages]

        for (const message of messages) {
            if (message.fileId) {
                const object = await getObject(message.fileId);
                if (object.isSuccess) {
                    messagesWithFiles.push({
                        ...message,
                        file: object.data
                    });
                }
                else {
                    messagesWithFiles.push({
                        ...message,
                        file: null
                    });
                }
            }

            return ResponseApi.Ok(response, messagesWithFiles);
        }
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
            return ResponseApi.NotFound(response, { error: `Message with id ${messageId} and contact id ${contactId} not found` });
        }

        return ResponseApi.Ok(response, message);
    }

    private static async createMessage(request: IncomingMessage, response: ServerResponse) {
        const contactId = request.url ? ExtractContactId.fromUrl(request.url) : null;
        if (!contactId) {
            return ResponseApi.BadRequest(response, { error: "Invalid contact id" });
        }

        const form = await RequestMultiPartData.getFormData(request)

        if (!form.fields || !form.files) {
            return ResponseApi.BadRequest(response, { error: "No form data" });
        }

        console.log('Form data:', form);
        const message = await UpsertMessageDto.fromForm(form);

        if (!message.isSuccess) {
            return ResponseApi.BadRequest(response, { error: message.errors });
        }

        if (!message.data.text || !message.data.file) {
            return ResponseApi.BadRequest(response, { error: "Text and file are required" });
        }


        if (message.data.file) {
            console.log('Storing object with text:', message.data.text);
            const blobData = new Blob([message.data.file]);
            const storeResult = await storeObject(blobData);

            if (!storeResult.isSuccess) {
                console.error('Z. Error storing object:', storeResult);
                return ResponseApi.InternalServerError(response);
            }

            console.log('Stored object:', storeResult.data);

            message.data.fileId = storeResult.data as string;
        }

        const newMessage = await prisma.message.create({
            data: {
                text: message.data.text,
                fileId: message.data.fileId,
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

        const message = await prisma.message.findFirst({
            where: {
                id: messageId,
                contactId: contactId
            }
        });

        if (!message) {
            return ResponseApi.NotFound(response, { error: `Message with id ${messageId} and contact id ${contactId} not found` });
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

        if (!message.isSuccess) {
            return ResponseApi.BadRequest(response, { error: message.errors });
        }

        const validationResult = UpsertMessageDto.isValid(message.data);

        if (!validationResult.isSuccess) {
            return ResponseApi.BadRequest(response, { error: validationResult.errors });
        }

        const existingMessage = await prisma.message.findFirst({
            where: {
                id: messageId,
                contactId: contactId
            }
        });

        if (!existingMessage) {
            return ResponseApi.NotFound(response, { error: `Message with id ${messageId} and contact id ${contactId} not found` });
        }

        const updatedMessage = await prisma.message.update({
            where: {
                id: messageId
            },
            data: message.data
        });

        return ResponseApi.Ok(response, updatedMessage);
    }


}

export default MessageEndpoint;
