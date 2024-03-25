import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { allowedTypeFormat } from './extractFileType';

interface StoredObject {
    key: string;
    metadata: Record<string, string>;
    data: Buffer;
}

interface CreateStoredObject {
    objectType: string;
    data: Buffer;
}

export class StoreService {
    private static storagePath = path.join(__dirname, '../data');
    private static defaultNames = {
        object: 'data',
        metadata: 'metadata.json',
    };

    public static async create(newObject: CreateStoredObject): Promise<StoredObject> {
        const key = uuidv4();
        const objectPath = `${this.storagePath}/${key}`;
        const metadata = {
            objectType: newObject.objectType,
            createdAt: new Date().toISOString(),
            key
        };

        const formatedType = allowedTypeFormat(newObject.objectType);

        fs.mkdirSync(objectPath);
        fs.writeFileSync(`${objectPath}/${this.defaultNames.object}.${formatedType}`, newObject.data);
        fs.writeFileSync(`${objectPath}/${this.defaultNames.metadata}`, JSON.stringify(metadata));

        return {
            key,
            metadata,
            data: newObject.data,
        };
    }

    public static async read(key: string): Promise<StoredObject> {
        const objectPath = `${this.storagePath}/${key}`;
        const metadata = JSON.parse(fs.readFileSync(`${objectPath}/${this.defaultNames.metadata}`, 'utf8'));

        const formatedType = allowedTypeFormat(metadata.objectType);
        const data = fs.readFileSync(`${objectPath}/${this.defaultNames.object}.${formatedType}`);

        return {
            key,
            metadata,
            data,
        };
    }
}
