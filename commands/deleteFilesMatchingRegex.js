const { configureS3Client } = require('../config/s3ClientConfig');
const { ListObjectsCommand, DeleteObjectsCommand } = require('@aws-sdk/client-s3');

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

module.exports = deleteFilesMatchingRegex;
