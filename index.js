require('dotenv').config();
const { configureS3Client } = require('./config/s3ClientConfig');
const { ListObjectsV2Command, PutObjectCommand, ListObjectsCommand, DeleteObjectsCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

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

const listFilesMatchingRegex = async (bucketName, regex) => {
    try {
        const s3Client = await configureS3Client(bucketName);
        const params = {
            Bucket: bucketName,
            Prefix: 'a-wing/'
        };

        const command = new ListObjectsCommand(params);
        const data = await s3Client.send(command);
        
        const regexPattern = new RegExp(regex);
        data.Contents.forEach(file => {
            if (regexPattern.test(file.Key)) {
                console.log(file.Key);
            }
        });
    } catch (error) {
        console.error('Error listing files matching regex:', error);
    }
};

const deleteFilesMatchingRegex = async (bucketName, regex) => {
    try {
        const s3Client = await configureS3Client(bucketName);
        const params = {
            Bucket: bucketName,
            Prefix: 'a-wing/'
        };

        const command = new ListObjectsCommand(params);
        const data = await s3Client.send(command);

        const objectsToDelete = data.Contents.filter(file => {
            const regexPattern = new RegExp(regex);
            return regexPattern.test(file.Key);
        }).map(file => {
            return { Key: file.Key };
        });

        if (objectsToDelete.length > 0) {
            const deleteParams = {
                Bucket: bucketName,
                Delete: {
                    Objects: objectsToDelete
                }
            };
            const deleteCommand = new DeleteObjectsCommand(deleteParams);
            const deleteData = await s3Client.send(deleteCommand);
            console.log(`Deleted ${deleteData.Deleted.length} objects`);
        } else {
            console.log('No matching files found to delete');
        }
    } catch (error) {
        console.error('Error deleting files matching regex:', error);
    }
};



const args = process.argv.slice(2);


if (args[0] === 'list-files') {
    listFiles(bucketName);
} else if (args[0] === 'upload-file') {
    const filePath = args[1];
    const key = args[2];
    uploadFile(bucketName, filePath, key);
} else if (args[0] === 'list-files-regex') {
    const regex = args[1];
    listFilesMatchingRegex(bucketName, regex);
} else if (args[0] === 'delete-files-regex') {
    const regex = args[1];
    deleteFilesMatchingRegex(bucketName, regex);
} else {
    console.log('Invalid command. Use one of: list-files, upload-file, list-files-regex, delete-files-regex');
}