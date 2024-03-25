import Result from "./utils/Result";
import fs from "fs";

export class ContactDto {
    constructor(public id: number, public name: string, public email: string, public createdAt: Date) { }
}

export class UpsertContactDto {
    constructor(public name: string, public email: string) { }

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

        return errors.length > 0 ? Result.FailMany(errors) : Result.Success();

    }
}

export class Message {
    constructor(public id: number, public text: string, public createdAt: Date, public contactId: number, public document: string) { }
}

export class UpsertMessageDto {
    constructor(public text: string, public file: Buffer | null = null) { }

    public static isValid(json: any): Result {
        const errors: string[] = [];
        if (typeof json?.text !== "string") {
            console.log(json);
            errors.push("Text is required");
        }
        else if (json.text.length === 0) {
            errors.push("Text length must be greater than 0");
        }

        return errors.length > 0 ? Result.FailMany(errors) : Result.Success();
    }

    public static async fromForm(form: any): Promise<Result> {
        const text = form.fields.text[0] as string;
        const filePath = form.files.file[0].filepath as string;

        const file = await this.getFileBinary(filePath);

        console.log('Text:', text);
        console.log('Type:', typeof file);

        if (!text || !file) {
            return Result.Fail("Text and file are required!");
        }

        return Result.Success(new UpsertMessageDto(text, file));
    }

    static async getFileBinary(filePath: string): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
}