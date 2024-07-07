const { configureS3Client } = require('../config/s3ClientConfig');
const { ListObjectsV2Command } = require('@aws-sdk/client-s3');

const listFiles = async (bucketName) => {
    try {
        const s3Client = await configureS3Client(bucketName);
        const params = {
            Bucket: bucketName,
            Prefix: 'a-wing/'
        };

        const command = new ListObjectsV2Command(params);
        const data = await s3Client.send(command);
        data.Contents.forEach(file => {
            console.log(file.Key);
        });
    } catch (error) {
        console.error('Error listing files:', error);
    }
};

module.exports = listFiles;
