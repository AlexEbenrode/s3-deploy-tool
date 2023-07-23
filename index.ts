import Minio from 'minio';
import fs from 'fs';
import mime from 'mime';

export async function deploy(folderPath: string, config: Minio.ClientOptions, bucketName: string) {
  const minioClient = new Minio.Client(config);

  const data: any = []
  const stream = minioClient.listObjects(bucketName, '', true)

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
          let trimRoot = path.replace(`${folderPath}`, '');
          trimRoot = (trimRoot === '' ? trimRoot : `${trimRoot}/`).substring(1);

          const splittedFileName = object.name.split('.');

          const contentType = mime.getType(splittedFileName[splittedFileName.length - 1]);
          const metaData = {
            'Content-Type': contentType,
          };
          await minioClient.putObject(bucketName, `${trimRoot}${object.name}`, fileStream, stats.size, metaData, (err, objInfo) => {
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

