import * as dotenv from 'dotenv';
dotenv.config()

import _ from 'lodash';

import path from 'path';
import VError from 'verror';
import { v1 as uuid } from 'uuid';

import FsService from './modules/fs/fs.service.js';
import CloudService from './modules/cloud/cloud.service.js';
import ValidatorService from './modules/validator/validator.service.js';
import ProcessorService from './modules/processor/processor.service.js';

import FsConstants from './modules/fs/fs.constants.js';

import { ONE_HUNDRED_MEGABYTES } from './common/constants.js';

const __dirname = '';

const parseFilesFromForm = (form, req) => {
  return new Promise((resolve, reject) => {
    form.parse(req, (error, fields, files) => {
      if (error) {
        reject(error);
        return;
      }

      const schema = createFormFieldSchema();
      const { error: validationError } = schema.validate(fields);

      if (validationError) {
        reject(validationError);
        return;
      }

      resolve({ fields, files });
    });
  });
};

const extractFiles = async filesInfo => {
  for (const file of filesInfo) {
    const { filePath, destinationDirectory } = file;
    try {
      await new Promise((resolve, reject) => {
        extract(filePath, { dir: `${destinationDirectory}` }, error => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });
    } catch (error) {
      throw new VError(error, `failed to extract ${filePath}`);
    }
  }
};

const getProcessedBody = (filePath, exporter) => {
  return _.includes(filePath, '.html')
    ? ProcessorService.processClickthroughUrls(FsService.readFileUTF8(filePath), exporter)
    : Body = FsService.readFile(filePath);
}

const processAndUpload = async ({
  campaignId,
  directoryToUpload,
  fileBaseName,
  uploadId,
  exporter,
  flags,
}) => {
  const filesToUpload = await FsService.getFiles(path.resolve(__dirname, directoryToUpload));

  const uploadResults = [];

  for (const filePath of filesToUpload) {
    const Key = CloudService.getKey({
      filePath,
      directoryToUpload,
      campaignId,
      fileBaseName,
      uploadId,
    });

    const Body = getProcessedBody(filePath, exporter);

    await CloudService.uploadFile({
      filePath,
      uploadToGCS: flags.en_2127_upload_into_s3_and_gcs,
      Key,
      Body,
    });

    uploadResults.push({
      Key,
    });
  }

  return uploadResults;
};

async function handler(req, res, next) {
  const { flags } = res.locals;
  const { id: campaignId } = res.locals.campaign;

  FsService.persistTempFolders();

  const form = new formidable.IncomingForm();
  const filesInfo = [];
  let zipFileBaseName;
  let uploadId = uuid.v4();

  form.maxFileSize = ONE_HUNDRED_MEGABYTES;
  form.keepExtensions = true;
  form.multiples = true;
  form.uploadDir = FsConstants.UPLOAD_DIRECTORY;

  form.on('fileBegin', function (name, file) {
    const fileBaseName = path.basename(file.name, path.extname(file.name));
    const fileExtension = path.extname(file.name);
    const filePath = path.join(
      FsConstants.UPLOAD_DIRECTORY,
      `${fileBaseName}_${new Date().getTime()}${fileExtension}`
    );
    const destinationDirectory = path.join(FsConstants.EXTRACT_DIRECTORY, fileBaseName);

    filesInfo.push({
      fileBaseName,
      fileExtension,
      filePath,
      destinationDirectory,
    });

    if (!zipFileBaseName) {
      zipFileBaseName = fileBaseName;
    }

    file.path = filePath;
  });

  try {
    const { fields, files } = await parseFilesFromForm(form, req);
    const { dimensions, exporter } = fields;

    if (_.keys(files).length === 0) {
      return next(UserError.validationError('no files uploaded'));
    }

    const validFiles = _.every(filesInfo, ['fileExtension', '.zip']);

    if (!validFiles) {
      return next(UserError.validationError('unsupported file type'));
    }

    let s3UploadResults = {};

    await extractFiles(filesInfo);

    for (const file of filesInfo) {
      const { destinationDirectory: directoryToUpload, fileBaseName } = file;

      await ValidatorService.validateFile({ directoryToUpload, fileBaseName, exporter });

      s3UploadResults = await processAndUpload({
        campaignId,
        directoryToUpload,
        fileBaseName,
        uploadId,
        exporter,
        flags,
      });

      FsService.removeTempFolders();
    }

    const rootHtmlFile = _.find(s3UploadResults, ({ Key }) => {
      return _.includes(Key, '.html');
    }).Key;
    const rootHtmlFileBaseName = _.last(rootHtmlFile.split('/')).split('.html')[0];

    const { cdnUrl, markup } = getGeneratedMarkup({
      exporter,
      zipFileBaseName,
      rootHtmlFileBaseName,
      campaignId,
      dimensions,
      uploadId,
    });

    return next({ s3UploadResults, filesInfo, cdnUrl, markup, zipFileBaseName, campaignId });
  } catch (error) {
    return next(ServerError.unknownError(error));
  }
}

export default handler;
