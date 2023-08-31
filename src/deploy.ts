import * as Minio from 'minio';
import fs from 'fs';
import mime from 'mime';

/**
 * Get all files from folder and upload to s3 bucket via minio
 *
 * @param {string} folterPath - Folder path with files for upload
 * @param {Minio.ClientOptions} config - Minio config checkout Minio.ClientsOptions
 * @param {string} bucketName - Bucket name where files will be upload
 * @param {string} prefix - Prefix where files will be upload (optional)
 * 
 */

export async function deploy(folderPath: string, config: Minio.ClientOptions, bucketName: string, prefix?: string) {
  const minioClient = new Minio.Client(config);

  const data: any = []
  const stream = minioClient.listObjects(bucketName, prefix ?? '', true)

  function upload(path: string) {
    const directory = fs.readdirSync(path, { withFileTypes: true })

    directory.forEach(async (object: fs.Dirent) => {
      if (!object.isDirectory()) {
        const file = `${path}/${object.name}`
        const fileStream = fs.createReadStream(file)
        fs.stat(file, async (err, stats) => {
          if (err) {
            throw err;
          }
          let trimRoot = path.replace(`${folderPath}`, prefix ? `/${prefix}` : '');
          trimRoot = (trimRoot === '' ? trimRoot : `${trimRoot}/`).substring(1);

          const splittedFileName = object.name.split('.');

          const contentType = mime.getType(splittedFileName[splittedFileName.length - 1]);
          const metaData = {
            'Content-Type': contentType,
          };
          await minioClient.putObject(bucketName, `${trimRoot}${object.name}`, fileStream, stats.size, metaData, (err) => {
            if (err) {
              throw err;
            }
          });
        })
      } else {
        upload(`${path}/${object.name}`)
      }
    })
  }

  stream.on('data', (obj) => { data.push(obj) })
  stream.on('end', () => {
    minioClient.removeObjects(bucketName, data, (error) => {
      if (error) {
        throw `Unable to remove Objects: ${error}`
      }
      upload(folderPath)
    })
  })
};

