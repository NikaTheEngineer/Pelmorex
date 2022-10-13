import Loadash from 'lodash';

import mime from 'mime-types';
import VError from 'verror';

import StorageService from '../gcs/storage/storage.service.js';
import S3Service from '../aws/s3/s3.service.js';

const CloudService = {
  uploadFile: async ({
    filePath,
    uploadToGCS,
    Key,
    Body,
  }) => {
    const ContentType = mime.lookup(filePath);

    const params = {
      Key,
      Body,
      ContentType,
    };

    if (uploadToGCS) {
      if (process.env.GCS_UPLOAD_TO_CREATIVES) {
        await StorageService.uploadObjectToCreativesBucket({
          filePath,
          destination: Key,
        }).catch((err) => {
          throw new VError(err, 'Failed to upload file to GCS');
        });
      }
    }

    await S3Service.uploadObjectToCreativesBucket(params).catch((err) => {
      throw new VError(err, 'Failed to upload file to S3');
    });
  },

  getKey: ({
    filePath,
    directoryToUpload,
    campaignId,
    fileBaseName,
    uploadId
  }) => {
    const directoryPath = `${campaignId}/${fileBaseName}_${uploadId}/`;
    let cloudFilePath = filePath.replace(`${directoryToUpload}/`, '');

    if (Loadash.split(cloudFilePath, '/')[0] === fileBaseName) {
      cloudFilePath = cloudFilePath.replace(`${fileBaseName}/`, '');
    }

    return `${directoryPath}${cloudFilePath}`;
  },
};

export default CloudService;
