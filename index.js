#!/usr/bin/env node

require('dotenv').config();
const { S3Client, ListObjectsV2Command, GetBucketLocationCommand } = require('@aws-sdk/client-s3');


const detectBucketRegion = async (bucketName) => {
    const s3Client = new S3Client({
        region: 'us-east-1',
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
    });

    const params = { Bucket: bucketName };
    try {
        const command = new GetBucketLocationCommand(params);
        const data = await s3Client.send(command);
        const region = data.LocationConstraint || 'us-east-1';
        return region;
    } catch (error) {
        console.error('Error detecting bucket region:', error);
        throw error;
    }
};


const listFiles = async (bucketName) => {
    try {
        const region = await detectBucketRegion(bucketName);
        console.log(`Detected bucket region: ${region}`);
        const s3Client = new S3Client({
            region: region,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            }
        });

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

const args = process.argv.slice(2);

if (args[0] === 'list-files') {
    listFiles('developer-task');
}