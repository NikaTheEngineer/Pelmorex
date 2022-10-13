import { AWS } from "../../../mock.js";
import S3Constants from "./s3.constants.js";

const S3_KEY = process.env.S3_KEY;
const S3_SECRET = process.env.S3_SECRET;
const S3_CREATIVES_BUCKET = process.env.S3_CREATIVES_BUCKET;

const s3 = new AWS.S3({
  accessKeyId: S3_KEY,
  secretAccessKey: S3_SECRET,
});

const S3Service = {
  uploadObjectToCreativesBucket: ({
    Key,
    Body,
    ContentType = 'application/octet-stream',
  }) => {
    return new Promise((resolve, reject) => {
      s3.putObject({
        Bucket: S3_CREATIVES_BUCKET,
        ACL: S3Constants.ACL.PUBLIC_READ,
        ContentType: ContentType,
        Key,
        Body,
      }, (error, data) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(data);
      });
    });
  },
};

export default S3Service;
