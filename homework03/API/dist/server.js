"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.db = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const multer_1 = __importDefault(require("multer"));
const datastore_1 = require("@google-cloud/datastore");
const storage_1 = require("@google-cloud/storage");
const app = (0, express_1.default)();
dotenv_1.default.config();
const port = 8080;
const bucket_name = 'cloud-bucket-h3';
exports.db = new datastore_1.Datastore({
    projectId: "tema3-419306",
    keyFilename: "./firestore.json"
});
exports.storage = new storage_1.Storage({
    projectId: process.env.PROJECT_ID,
    keyFilename: process.env.KEY_FILENAME
});
app.get('/api/images', async (req, res) => {
    const pageNumber = req.query.page || 1;
    const pageSize = req.query.size || 10;
    const [images] = await exports.db.runQuery(exports.db.createQuery('images').limit(+pageSize).offset((+pageNumber - 1) * +pageSize));
    const totalCount = await exports.db.runQuery(exports.db.createQuery('images').select('__key__')).then((data) => data[0].length);
    res.json({ images, totalCount, currentPage: +pageNumber, pageSize: +pageSize });
});
app.post('/api/images', (0, multer_1.default)().single('image'), async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).send('No file uploaded.');
    }
    const bucket = exports.storage.bucket(bucket_name);
    const blob = bucket.file(file.originalname);
    const blobStream = blob.createWriteStream({
        resumable: false,
    });
    blobStream.on('error', (err) => {
        console.error(err);
    });
    blobStream.on('finish', async () => {
        const imageUrl = `https://storage.googleapis.com/${bucket_name}/${file.originalname}`;
        await exports.db.save({
            key: exports.db.key('images'),
            data: {
                url: imageUrl,
            }
        });
        res.json({ imageUrl });
    });
    blobStream.end(file.buffer);
});
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
