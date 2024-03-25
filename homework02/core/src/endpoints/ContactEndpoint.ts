import { IncomingMessage, ServerResponse } from "http";
import { Endpoint } from "./Endpoint";
import { prisma } from "../server";
import { requestBodyHelper } from "../utils/HttpUtils";
import { ContactDto, UpsertContactDto } from "../dtos";
import ResponseApi from "../utils/ResponseUtils";
import { ExtractContactId } from "../utils/ExtractIdentifier";
import { sendMail } from "../external/mail";
import { getObject } from "../external/storage";

class ContactEndpoint extends Endpoint {
    public static readonly ROUTES = [
        { method: "GET", path: "/contacts/\\w+", handler: ContactEndpoint.getContactById },
        { method: "GET", path: "/contacts", handler: ContactEndpoint.getContacts },
        { method: "POST", path: "/contacts", handler: ContactEndpoint.createContact },
        { method: "PUT", path: "/contacts/\\w+", handler: ContactEndpoint.updateContact },
        { method: "DELETE", path: "/contacts/\\w+", handler: ContactEndpoint.deleteContact }
    ]

    constructor(matchingExpression: string) {
        super(matchingExpression);
    }

    handle(request: IncomingMessage, response: ServerResponse): Promise<void> {
        for (const route of ContactEndpoint.ROUTES) {
            if (request.url?.match(route.path) && request.method === route.method) {
                return route.handler(request, response);
            }
        }

        return Promise.resolve(ResponseApi.NotImplemented(response));
    }

    private static async getContacts(_: IncomingMessage, response: ServerResponse) {
        const contacts = await prisma.contact.findMany();
        const contactDtos = contacts.map(contact => new ContactDto(contact.id, contact.name, contact.email, contact.createdAt));

        return ResponseApi.Ok(response, contactDtos);
    }

    private static async createContact(request: IncomingMessage, response: ServerResponse) {
        const contact = await requestBodyHelper.getJsonBody(request);

        if (!contact.isSuccess) {
            return ResponseApi.BadRequest(response, { error: contact.errors });
        }

        const validationResult = UpsertContactDto.isValid(contact.data);

        if (!validationResult.isSuccess) {
            return ResponseApi.BadRequest(response, { error: validationResult.errors });
        }

        const existingContact = await prisma.contact.findFirst({
            where: {
                email: contact.data.email
            }
        });

        if (existingContact) {
            return ResponseApi.Conflict(response, { error: `Contact with email ${contact.data.email} already exists` });
        }

        const newContact = await prisma.contact.create({
            data: contact.data
        });

        const mailText = `New contact created: ${newContact.name} - ${newContact.email}`;

        const mailResponse = await sendMail(mailText);

        if (!mailResponse.isSuccess) {
            console.error("Error sending mail");
        }
        else {
            console.log("Mail sent successfully");
        }

        return ResponseApi.Created(response, newContact);
    }


    private static async getContactById(request: IncomingMessage, response: ServerResponse) {
        const id = request.url ? ExtractContactId.fromUrl(request.url) : null;
        console.log(id);

        if (!id) {
            return ResponseApi.BadRequest(response, { error: "Invalid id" });
        }

        const contact = await prisma.contact.findUnique({
            where: {
                id
            },
            include: {
                messages: true
            }
        });


        if (!contact) {
            return ResponseApi.NotFound(response, { error: `Contact with id ${id} not found` });
        }


        const messagesWithFiles: any[] = [];

        for (const message of contact.messages) {
            if (message.fileId) {
                const object = await getObject(message.fileId);
                if (object.isSuccess) {
                    messagesWithFiles.push({
                        ...message,
                        file: object.data
                    });
                }
                else {
                    console.error("Error getting object with key", message.fileId);
                }

            }
            else {

                messagesWithFiles.push({
                    ...message,
                    file: null
                });
            }
        }

        return ResponseApi.Ok(response, {
            id: contact.id,
            name: contact.name,
            email: contact.email,
            createdAt: contact.createdAt,
            messages: messagesWithFiles
        });
    }

    private static async updateContact(request: IncomingMessage, response: ServerResponse) {
        const id = request.url ? ExtractContactId.fromUrl(request.url) : null;

        if (!id) {
            return ResponseApi.BadRequest(response, { error: "Invalid id" });
        }

        const contact = await requestBodyHelper.getJsonBody(request);

        const validationResult = UpsertContactDto.isValid(contact.data);

        if (!validationResult.isSuccess) {
            return ResponseApi.BadRequest(response, { error: validationResult.errors });
        }

        const existingContact = await prisma.contact.findUnique({
            where: {
                id
            }
        });

        if (!existingContact) {
            return ResponseApi.NotFound(response, { error: `Contact with id ${id} not found` });
        }

        const updatedContact = await prisma.contact.update({
            where: {
                id
            },
            data: contact.data
        });

        return ResponseApi.Ok(response, updatedContact);
    }

    private static async deleteContact(request: IncomingMessage, response: ServerResponse) {
        const id = request.url ? ExtractContactId.fromUrl(request.url) : null;
        if (!id) {
            return ResponseApi.BadRequest(response, { error: "Invalid id" });
        }

        const existingContact = await prisma.contact.findUnique({
            where: {
                id
            }
        });

        if (!existingContact) {
            return ResponseApi.NotFound(response, { error: `Contact with id ${id} not found` });
        }

        await prisma.contact.delete({
            where: {
                id
            }
        });

        const mailText = `Contact deleted: ${existingContact.name} - ${existingContact.email}`;

        const mailResponse = await sendMail(mailText);

        if (!mailResponse.isSuccess) {
            console.error("Error sending mail");
        }
        else {
            console.log("Mail sent successfully");
        }

        return ResponseApi.NoContent(response);
    }
}

export default ContactEndpoint;
