#! /usr/bin/env node
import { deploy } from "./src/deploy";

const args = process.argv.slice(2);

function showHelpInfo() {
  const text = `
  --help: show this message
  --path: folder path with files for upload
  --bucket: bucket name where files upload
  --prefix: prefix where files will be upload
  --endpoint: specify endpoint url for s3 bucket
  --key: specify access key for s3 bucket
  --secret specify secret key for s3 bucket
  --port: specify port for s3 bucket, default 80 or 443
  --disable-ssl: disable secure access 
  `
  console.log(text);
}

function main() {
  for (const [index, value] of args.entries()) {
    let path = '';
    let ssl = true;
    let bucket;
    let prefix;
    let endpoint;
    let key;
    let secret;
    let port;
    switch(value) {
      case '--help':
        showHelpInfo();
        return;
      case '--path':
        path = args[index + 1];
        break;
      case '--bucket':
        bucket = args[index + 1];
        break;
      case '--endpoint':
        endpoint = args[index + 1];
        break;
      case '--key':
        key = args[index + 1];
        break;
      case '--secret':
        secret = args[index + 1];
        break;
      case '--port':
        secret = args[index + 1];
        break;
      case '--disable-ssl':
        ssl = false;
        break;
      case '--prefix':
        prefix = args[index + 1];
        break;
    }
  
    if(!endpoint) 
      console.error('--endpoint is required');
    else if(!key) 
      console.error('--key is required');
    else if(!secret) 
      console.error('--secret is required');
    else if(!bucket) 
      console.error('--bucket is required');
    else{
      try {
        deploy(path, {
          endPoint: endpoint,
          port: port,
          secretKey: secret,
          accessKey: key,
          useSSL: ssl,
        },
        bucket, 
        prefix);
      }catch(error) {
        console.error(error);
      }
    }
  }
}

main();
