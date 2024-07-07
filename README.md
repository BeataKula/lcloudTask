# My S3 CLI

## Description
CLI for managing files in AWS S3. Supports listing files, uploading files, listing files matching a regex pattern, and deleting files matching a regex pattern.

## Usage

### List all files in the S3 bucket

```bash
node index.js list-files

### Upload a file to the S3 bucket

```bash
node index.js upload-file uploads/example.txt example.txt

### List files in the S3 bucket matching a regex pattern

```bash
node index.js list-files-regex ".*\.txt"

### Delete files in the S3 bucket matching a regex pattern

```bash
node index.js delete-files-regex "example.*\.txt"

### Configuration
Environment Variables
Before running the CLI, make sure you have set the required AWS environment variables:

```bash
export AWS_ACCESS_KEY_ID=your_access_key_id
export AWS_SECRET_ACCESS_KEY=your_secret_access_key

### Notes
The CLI requires AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables to be set.
Make sure you have the necessary access permissions to your S3 bucket.
The CLI is intended for use with Node.js version 14.x or newer.
