class ExtractId {
    static fromUrl(url: string, index: number): number | null {
        const id = url.split("/")[index];
        if (!id || id === "") {
            return null;
        }
        return parseInt(id);
    }
}

export class ExtractContactId {
    static fromUrl(url: string): number | null {
        return ExtractId.fromUrl(url, 3);
    }
}

export class ExtractMessageId {
    static fromUrl(url: string): number | null {
        return ExtractId.fromUrl(url, 5);
    }
}

