import express from 'express';
import { Request, Response } from 'express';
import multer from 'multer';

import { Datastore } from '@google-cloud/datastore';
import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import cors from 'cors';

const googleSetup = {
    projectId: "asdasdasdad",
    keyFilename: "./firestore.json"
}
initializeApp(googleSetup);

const app = express();
const port = 8082;
const bucket_name = 'cloud-bucket-h3'

app.use(cors());


export const db = new Datastore(googleSetup);
export const storage = new Storage(googleSetup);


async function verify(req: Request, res: Response, next: any) {
    const bearerToken = req.headers['authorization']
    if (!bearerToken) {
        console.log('No token provided: ', bearerToken);
        return res.status(401).send('No token provided');
    }
    //

    const token = bearerToken.split(' ')[1];

    try {
        const decodedToken = await getAuth().verifyIdToken(token);
        const uid = decodedToken.uid;
        console.log('UID: ', uid);
        // @ts-ignore
        req.userId = uid;

        // @ts-ignore
        req.email = decodedToken.email;
        next();
    } catch (error) {
        console.error('Error: ', error);
        return res.status(401).send('Invalid token');
    }
}


app.get('/api/images', verify, async (req, res) => {
    const pageNumber = req.query.page || 1;
    const pageSize = req.query.size || 10;
    const my = req.query.my || false;

    // @ts-ignore
    const userId = req.userId;

    const query = db.createQuery('images').limit(+pageSize).offset((+pageNumber - 1) * +pageSize);

    if (my) {
        query.filter('authorId', '=', userId);
    }

    const [images] = await db.runQuery(query);
    const queryTotalCount = db.createQuery('images');
    if (my) {
        queryTotalCount.filter('authorId', '=', userId);
    }
    const totalCount = await db.runQuery(queryTotalCount.select('__key__')).then((data) => data[0].length);

    res.json({ images, totalCount, currentPage: +pageNumber, pageSize: +pageSize });
});


app.post('/api/images', verify, multer().single('image'), async (req: Request, res: Response) => {
    const file = req.file;

    if (!file) {
        return res.status(400).send('No file uploaded.');
    }

    const description = req.body.description;
    // @ts-ignore
    const userId = req.userId;
    // @ts-ignore
    const email = req.email;
    const imageId = uuidv4();


    const bucket = storage.bucket(bucket_name);
    const blob = bucket.file(imageId);

    const blobStream = blob.createWriteStream({
        resumable: false,
    });

    blobStream.on('error', (err) => {
        console.error(err);
    });

    blobStream.on('finish', async () => {
        const imageUrl = `https://storage.googleapis.com/${bucket_name}/${imageId}`;
        await db.save({
            key: db.key('images'),
            data: {
                url: imageUrl,
                extension: file.originalname.split('.').pop(),
                authorEmail: email,
                authorId: userId,
                description: description,
                createdAt: new Date()
            }
        });

        res.json({ imageUrl });
    });

    blobStream.end(file.buffer);
});



app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
