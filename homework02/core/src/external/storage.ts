import dotenv from 'dotenv';
import Result from '../utils/Result';

dotenv.config();

export const storeObject = async (data: Blob): Promise<Result> => {
    try {
        const formData = new FormData();
        formData.append('data', data, 'data');

        const response = await fetch(`${process.env.STORAGE_API_URL}/objects`, {
            method: 'POST',
            headers: {
                'X-API-Key': process.env.STORAGE_API_KEY
            } as HeadersInit,
            body: formData
        });

        if (response.status === 201) {
            const json = await response.json();
            const key = json.key as string;
            return Result.Success(key);
        } else {
            console.log('X. Error storing object:', response);
            return Result.Fail('Error storing object');
        }
    }
    catch (error) {
        console.error('Y. Error storing object:', error);
        return Result.Fail('Error storing object');
    }
}


export const getObject = async (key: string): Promise<Result> => {
    try {
        const response = await fetch(`${process.env.STORAGE_API_URL}/objects/${key}`, {
            method: 'GET',
            headers: {
                'X-API-Key': process.env.STORAGE_API_KEY,
            } as HeadersInit
        });

        if (response.status === 200) {
            const json = await response.json() as { metadata: { objectType: string }, data: string };
            return Result.Success(json);
        } else {
            return Result.Fail('Error getting object');
        }
    }
    catch (error) {
        console.error('Error getting object:', error);
        return Result.Fail('Error getting object');
    }
}

