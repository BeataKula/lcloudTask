require('dotenv').config();
const { configureS3Client } = require('./config/s3ClientConfig');
const { ListObjectsV2Command, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');

const bucketName = 'developer-task';
const localFilePath = 'uploads/exampleBK.txt';
const remoteFileName = 'exampleBK.txt';

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

const uploadFile = async (bucketName, filePath, key) => {
    try {
        const s3Client = await configureS3Client(bucketName);
        const fileStream = fs.createReadStream(filePath);

        const params = {
            Bucket: bucketName,
            Key: key,
            Body: fileStream
        };
       
        const command = new PutObjectCommand(params);
        await s3Client.send(command);
        console.log(`File uploaded successfully: ${key}`);
    } catch (error) {
        console.error('Error uploading file:', error);
    }
};

const args = process.argv.slice(2);

if (args[0] === 'list-files') {
    listFiles(bucketName);
} else if (args[0] === 'upload-file') {
    const filePath = args[1];
    const key = `a-wing/${args[2]}`;
    uploadFile(bucketName, filePath, key); //node index.js upload-file uploads/exampleBK.txt exampleBK.txt
}