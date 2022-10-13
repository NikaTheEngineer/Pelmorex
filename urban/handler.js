import * as dotenv from 'dotenv';
dotenv.config()

import _ from 'lodash';

import path from 'path';
import VError from 'verror';
import { v1 as uuid } from 'uuid';

import FsService from './modules/fs/fs.service.js';
import CloudService from './modules/cloud/cloud.service.js';

import FsConstants from './modules/fs/fs.constants.js';

const ONE_HUNDRED_MEGABYTES = 100 * 1024 * 1024;

const __dirname = '';

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
      UPLOAD_DIRECTORY,
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

      await validateFile({ directoryToUpload, fileBaseName, exporter });

      s3UploadResults = await uploadDirectoryToS3({
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

const validateFile = async ({ fileBaseName, directoryToUpload, exporter }) => {
  switch (exporter) {
    case 'gwd':
      await validateGWDZipFile({ fileBaseName, directoryToUpload });
      break;
    case 'conversio':
      await validateConversioZipFile({ fileBaseName, directoryToUpload });
      break;
    default:
      await validateGWDZipFile({ fileBaseName, directoryToUpload });
  }
};

export const validateGWDZipFile = async ({
  fileBaseName,
  directoryToUpload,
  _getFiles = FsService.getFiles,
  _readRootHtmlFile = FsService.readFileUTF8,
} = {}) => {
  const files = await _getFiles(path.resolve(__dirname, directoryToUpload));

  const rootHtmlFile = _.find(files, file => _.includes(file, '.html'));

  if (!rootHtmlFile) {
    throw new VError('Zip file does not contain a root .html file');
  }

  const rootHtmlFileBaseName = _(rootHtmlFile)
    .replace(`${FsConstants.EXTRACT_DIRECTORY}/${fileBaseName}/`, '')
    .split('.html')[0]
    .split('/')[0];

  if (!_.includes(fileBaseName, rootHtmlFileBaseName)) {
    throw new VError(
      `Zip file name '${fileBaseName}' does not contain basename '${rootHtmlFileBaseName}'`
    );
  }

  const rootHtmlString = _readRootHtmlFile(rootHtmlFile);

  if (rootHtmlString.length < 1) {
    throw new VError('Root .html file is missing content');
  }

  const containsGWDMeta = _.includes(
    rootHtmlString,
    'name="generator" content="Google Web Designer'
  );

  if (!containsGWDMeta) {
    throw new VError('Root .html file does not contain Google Web Designer metadata');
  }

  const hasAssets = _.filter(files, file => _.includes(file, 'assets/')).length > 0;
  const linksAssets = _.includes(rootHtmlString, 'src="assets/');

  if (linksAssets && !hasAssets) {
    throw new VError('Zip file is missing assets folder for linked assets');
  }

  return true;
};

export const validateConversioZipFile = async ({
  fileBaseName,
  directoryToUpload,
  _getFiles = FsService.getFiles,
  _readRootHtmlFile = FsService.readFileUTF8,
} = {}) => {
  const files = await _getFiles(path.resolve(__dirname, directoryToUpload));

  const rootHtmlFile = _.find(files, file => _.includes(file, '.html'));

  if (!rootHtmlFile) {
    throw new VError('Zip file does not contain a root .html file');
  }

  const rootHtmlFileBaseName = _(rootHtmlFile)
    .replace(`${FsConstants.EXTRACT_DIRECTORY}/${fileBaseName}/`, '')
    .split('.html')[0]
    .split('/')[0];

  if (!_.includes(fileBaseName, rootHtmlFileBaseName)) {
    throw new VError(
      `Zip file name '${fileBaseName}' does not contain basename '${rootHtmlFileBaseName}'`
    );
  }

  const rootHtmlString = _readRootHtmlFile(rootHtmlFile);

  if (rootHtmlString.length < 1) {
    throw new VError('Root .html file is missing content');
  }

  return true;
};

const uploadDirectoryToS3 = async ({
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

    let Body;

    if (_.includes(filePath, '.html')) {
      Body = FsService.readFileUTF8(filePath);

      switch (exporter) {
        case 'gwd':
          Body = processGWDClickthroughUrls(Body);
          break;
        case 'conversio':
          Body = processConversioClickthroughUrls(Body);
          break;
        default:
          Body = processGWDClickthroughUrls(Body);
      }
    } else {
      Body = FsService.readFile(filePath);
    }

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

export const processGWDClickthroughUrls = body => {
  let output = body;

  const exitEventRegex = /.exit\([^\)]+\)/gm;
  const urlRegex = /(["']https?:\/\/[^\s]+["'],)/g;

  _.each(body.match(exitEventRegex), params => {
    const formattedParams = params.replace(urlRegex, url => {
      const trimmedUrl = _.chain(url)
        .trimStart(`'`)
        .trimEnd(`',`)
        .trimStart(`"`)
        .trimEnd(`",`)
        .value();
      return `decodeURIComponent(window.location.href.split('?adserver=')[1]) + '${trimmedUrl}',`;
    });

    output = output.replace(params, formattedParams);
  });

  return output;
};

export const processConversioClickthroughUrls = body => {
  let output = body;

  const clickTagRegex = /clickTag\s*=\s*["'](\S*)["']/gi;
  const urlRegex = /(["']https?:\/\/[^\s]+["'])/g;

  _.each(body.match(clickTagRegex), params => {
    const formattedParams = params.replace(urlRegex, url => {
      const trimmedUrl = _.chain(url)
        .trim(`'`)
        .trim(`"`)
        .value();
      return `decodeURIComponent(window.location.href.split('?adserver=')[1]) + "${trimmedUrl}"`;
    });

    output = output.replace(params, formattedParams);
  });

  return output;
};

export default handler;
