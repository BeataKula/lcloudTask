const { configureS3Client } = require('../config/s3ClientConfig');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

const uploadFile = async (bucketName, filePath, key) => {
    try {
        const s3Client = await configureS3Client(bucketName);
        const fileStream = fs.createReadStream(filePath);

        const timestamp = Date.now();
        const fileExtension = path.extname(key); 
        const fileNameWithoutExt = path.basename(key, fileExtension);
        const newFileName = `${fileNameWithoutExt}_${timestamp}${fileExtension}`;

        console.log(`new name: ${newFileName}`);

        const params = {
            Bucket: bucketName,
            Key: `a-wing/${newFileName}`,
            Body: fileStream
        };

        const command = new PutObjectCommand(params);
        await s3Client.send(command);
        console.log(`File uploaded successfully with new name: ${newFileName}`);
    } catch (error) {
        console.error('Error uploading file:', error);
    }
};

module.exports = uploadFile;