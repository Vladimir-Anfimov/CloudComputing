import { fromBuffer } from 'file-type';
import { NotSupportedFileType } from './exceptions/NotSupportedFileType';

export const allowedTypes = ['image/png'];

export const allowedTypeFormat = (format: string) => {
    if (!allowedTypes.includes(format)) {
        throw new NotSupportedFileType();
    }
    return format.split('/')[1];
}

export const extractFileType = async (buffer: Buffer) => {
    const fileTypeResult = await fromBuffer(buffer);
    if (!fileTypeResult || !allowedTypes.includes(fileTypeResult.mime)) {
        throw new NotSupportedFileType();
    }

    return fileTypeResult;
};