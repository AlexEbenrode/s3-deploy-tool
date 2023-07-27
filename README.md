# s3-deploy-tool

Simple tool for deploy static files for web site to s3 buckets

## Installing

```
npm i s3-deploy-tool
```
## Usage exmple

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
