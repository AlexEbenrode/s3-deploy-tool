# s3-deploy-tool

Simple tool for deploy static files for web site to s3 buckets

## Installing

```
npm i s3-deploy-tool
```
## Usage example

### via nodejs

```
import { deploy } from 's3-deploy-tool';

deploy(
  'path/to/folder',
  {
    endPoint: example.com,
    accessKey: ********,
    secretKey: ********,
    port: 9000,
    useSSL: true,
  },
  'test_bucket_name',
  'prefix',
);
```

deploy() will delete all files from bucket or folder if prefix provided and load files from specified folder

### via npx

```
npx s3-deploy-tool --path path/to/folder --endpoint example.com --key ******** --secret ******** --port 9000 --bucket test_bucket_name --prefix prefix
```

Full args list

--help: show all args in console
--path: folder path with files for upload
--bucket: bucket name where files upload
--prefix: prefix where files will be upload
--endpoint: specify endpoint url for s3 bucket
--key: specify access key for s3 bucket
--secret specify secret key for s3 bucket
--port: specify port for s3 bucket, default 80 or 443
--disable-ssl: disable secure access 