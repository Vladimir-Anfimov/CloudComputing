import Result from "./utils/Result";

export class ContactDto {
    constructor(public id: number, public name: string, public email: string, public createdAt: Date) {}
}

export class UpsertContactDto {
    constructor(public name: string, public email: string) {}

    public static isValid(json: any): Result {
        const errors: string[] = [];

        if (typeof json?.name !== "string") {
            errors.push("Name is required");
        }
        else if (json.name.length === 0) {
            errors.push("Name is required");
        }

        if (typeof json?.email !== "string") {
            errors.push("Email is required");
        }
        else if (json.email.length === 0) {
            errors.push("Email length must be greater than 0");
        }
        else if (!json.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
            errors.push("Email is invalid");
        }

        return errors.length > 0 ? Result.Fail(errors) : Result.Success();

    }
}

export class Message {
    constructor(public id: number, public text: string, public createdAt: Date, public contactId: number) {}
}

export class UpsertMessageDto {
    constructor(public text: string) {}

    public static isValid(json: any): Result {
        const errors: string[] = [];
        if (typeof json?.text !== "string") {
            console.log(json);
            errors.push("Text is required");
        }
        else if (json.text.length === 0) {
            errors.push("Text length must be greater than 0");
        }

        return errors.length > 0 ? Result.Fail(errors) : Result.Success();
    }
}