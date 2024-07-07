const { configureS3Client } = require('../config/s3ClientConfig');
const { ListObjectsCommand } = require('@aws-sdk/client-s3');

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

module.exports = listFilesMatchingRegex;