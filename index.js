require('dotenv').config();
const { configureS3Client } = require('./config/s3ClientConfig');
const { ListObjectsV2Command, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

const bucketName = 'developer-task';

const listFiles = require('./commands/listFiles');
const uploadFile = require('./commands/uploadFile');
const listFilesMatchingRegex = require('./commands/listFilesMatchingRegex');
const deleteFilesMatchingRegex = require('./commands/deleteFilesMatchingRegex');

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
