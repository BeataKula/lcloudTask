const { S3Client, GetBucketLocationCommand } = require('@aws-sdk/client-s3');

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


const configureS3Client = async (bucketName) => {
    const region = await detectBucketRegion(bucketName);

    const s3Client = new S3Client({
        region: region, 
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
    });

    return s3Client;
};

module.exports = {
    detectBucketRegion,
    configureS3Client
};
