import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

export const editFileName = (file: any, callback: any) => {
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

    callback(`${fileName}.${randomName}.${fileExtName}`);
};
