export class NotSupportedFileType extends Error {
    constructor() {
        super('File type is not supported');
    }
}