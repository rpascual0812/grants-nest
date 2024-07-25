export const generatePath = (path: any, callback: any) => {
    const complete_path: string = 'https://' + process.env.AWS_S3_BUCKET_NAME + '.s3.' + process.env.AWS_S3_REGION + '.amazonaws.com/' + path;
    callback(complete_path);
}