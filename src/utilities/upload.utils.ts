import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

export const imageFileFilter = (req: any, file: any, callback: any) => {
    if (!file.mimetype.match(/(mp4|jpe?g|gif|png|pdf|doc|docx|xls|xlsx|txt|zip|vnd.openxmlformats-officedocument.wordprocessingml.document|vnd.openxmlformats-officedocument.spreadsheetml.sheet)$/)) {
        // if (!file.mimetype.match(/image.*/)) {
        return callback(new Error('File type not allowed!'), false);
    }
    callback(null, true);
};

export const editFileName = (req: any, file: any, callback: any) => {
    const date = new Date().valueOf();
    let text = '';
    const possibleText = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 50; i++) {
        text += possibleText.charAt(Math.floor(Math.random() * possibleText.length));
    }

    let fileName = date + '.' + uuidv4() + '.' + uuidv4() + '.' + uuidv4();
    const originalName = file.originalname.split('.');
    let fileExtName = originalName[originalName.length - 1];

    const randomName = Array(16)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');

    callback(null, `${fileName}.${randomName}.${fileExtName}`);
};
