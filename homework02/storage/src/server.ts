import express from 'express';
import dotenv from 'dotenv';
import zod from 'zod';
import { NotSupportedFileType } from './exceptions/NotSupportedFileType';
import { allowedTypes, extractFileType } from './extractFileType';
import { StoreService } from './storeService';
import multer from 'multer';

dotenv.config();

const app = express();
const port = process.env.PORT;

const upload = multer()

app.use(express.json());

app.use((req, res, next) => {
    const apiKey = req.header('X-API-Key');
    if (apiKey === process.env.API_KEY) {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
});

app.post('/api/objects', upload.single('data'), async (req, res) => {
    if (!req.file) {
        console.log(`[server]: Invalid request multi-part ${JSON.stringify(req.body)}`);
        res.status(400).json({ message: 'Invalid request, missing the uploaded file.' });
        return;
    }
    console.log(`[server]: Received request with file ${req.file}`);
    const data = req.file.buffer;
    if (!data) {
        res.status(400).json({ message: 'Invalid request, missing the uploaded file.' });
        return;
    }

    try {
        const fileType = await extractFileType(data);
        const storedOject = await StoreService.create({ objectType: fileType.mime, data });
        res.status(201).json({ key: storedOject.key });
        console.log(`[server]: Stored object with key ${storedOject.key}`);

    } catch (error) {
        console.error(`[server]: ${error}`)
        if (error instanceof zod.ZodError) {
            res.status(400).json({ message: 'Invalid request body' });
        }
        else if (error instanceof NotSupportedFileType) {
            res.status(400).json({ message: `File type not supported. Supported types are: ${allowedTypes.join(', ')}` });
        }
        else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});


app.get('/api/objects/:key', async (req, res) => {
    const key = req.params.key;
    console.log(`[server]: Received request to get object with key ${key}`);

    const keySchema = zod.string().uuid();

    try {
        keySchema.parse(key);
    } catch (error) {
        res.status(400).json({ message: 'Invalid key format' });
        return;
    }

    const storedObject = await StoreService.read(key);
    if (!storedObject) {
        res.status(404).json({ message: 'Object not found' });
        return;
    }
    res.status(200).json({
        metadata: storedObject.metadata,
        data: storedObject.data.toString('base64'),
    });
    console.log(`[server]: Sent object with key ${key}`);
});


app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
