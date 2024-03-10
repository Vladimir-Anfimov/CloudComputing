export class ContactDto {
    constructor(public id: number, public name: string, public email: string, public createdAt: Date) {}
}

export class UpsertContactDto {
    constructor(public name: string, public email: string) {}

    public static isValid(json: any): json is UpsertContactDto {
        return typeof json?.name === "string" 
            && typeof json?.email === "string" 
    }
}

export class Message {
    constructor(public id: number, public text: string, public createdAt: Date, public contactId: number) {}
}

export class UpsertMessageDto {
    constructor(public text: string) {}

    public static isValid(json: any): json is UpsertMessageDto {
        return typeof json?.text === "string";
    }
}