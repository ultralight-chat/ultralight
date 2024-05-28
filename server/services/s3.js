import { Upload } from "@aws-sdk/lib-storage";
import { v4 as uuid } from 'uuid';

import client from '../app.js'

export default {
  uploadFile: async (attachment) => {
    return new Promise(async (resolve, reject) => {
      setTimeout(async () => {
        try {
          const upload = new Upload({
            client: client,
            // queueSize: 4, // optional concurrency configuration
            leavePartsOnError: false, // optional manually handle dropped parts
            params: { 
              Bucket: process.env.s3_bucket,
              Key: attachment.attachmentid,
              Body: attachment.file,
              ContentType: attachment.info.mimeType, 
              Metadata:{name: attachment.info.filename}
          }});
    
          upload.on("httpUploadProgress", (progress) => {
            console.log(progress);
          });
    
          upload.on("abort", (e) => {
            return reject(e);
          })
    
          return resolve(await upload.done());
        } catch (e) { return reject(e) }
      }, 120000);
    });
  
    
    // try {
    //   const response = await client.send(command);
    //   return response.ETag;
    // } catch (err) {
    //   console.error(err);
    // }
  },
  downloadfile: async (attachmentid) => {
    try {
      client
      .getObject({
        Bucket: process.env.s3_bucket,
        Key: attachmentid
      })
      .createReadStream()
      .pipe(res);
    } catch{}
  }
}