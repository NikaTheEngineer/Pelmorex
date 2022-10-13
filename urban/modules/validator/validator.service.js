import Loadash from 'lodash';
import path from 'path';
import VError from 'verror';

import FsService from '../fs/fs.service.js';

import FsConstants from '../fs/fs.constants.js';

const __dirname = '';

const getValidHTMLFile = (files) => {
  const rootHtmlFile = Loadash.find(files, file => Loadash.includes(file, '.html'));

  if (!rootHtmlFile) {
    throw new VError('Zip file does not contain a root .html file');
  }

  return rootHtmlFile;
};

const checkBaseName = (fileBaseName, rootHtmlFile) => {
  const rootHtmlFileBaseName = Loadash(rootHtmlFile)
    .replace(`${FsConstants.EXTRACT_DIRECTORY}/${fileBaseName}/`, '')
    .split('.html')[0]
    .split('/')[0];

  if (!Loadash.includes(fileBaseName, rootHtmlFileBaseName)) {
    throw new VError(
      `Zip file name '${fileBaseName}' does not contain basename '${rootHtmlFileBaseName}'`
    );
  }
};

const validateGWD = ({
  rootHtmlString,
  files
}) => {
  const containsGWDMeta = Loadash.includes(
    rootHtmlString,
    'name="generator" content="Google Web Designer'
  );

  if (!containsGWDMeta) {
    throw new VError('Root .html file does not contain Google Web Designer metadata');
  }

  const hasAssets = Loadash.filter(files, file => Loadash.includes(file, 'assets/')).length > 0;
  const linksAssets = Loadash.includes(rootHtmlString, 'src="assets/');

  if (linksAssets && !hasAssets) {
    throw new VError('Zip file is missing assets folder for linked assets');
  }
}

const validateHTML = async ({
  fileBaseName, directoryToUpload, _getFiles, _readRootHtmlFile
}, GWD = false) => {
  const files = await _getFiles(path.resolve(__dirname, directoryToUpload));

  const rootHtmlFile = getValidHTMLFile(files);

  checkBaseName(fileBaseName, rootHtmlFile);

  const rootHtmlString = _readRootHtmlFile(rootHtmlFile);

  if (rootHtmlString.length < 1) {
    throw new VError('Root .html file is missing content');
  }

  GWD && validateGWD({
    rootHtmlString,
    files
  });

  return true;
}

const validateGWDZipFile = async ({
  fileBaseName,
  directoryToUpload,
  _getFiles = FsService.getFiles,
  _readRootHtmlFile = FsService.readFileUTF8,
} = {}) => {
  return validateHTML({
    fileBaseName,
    directoryToUpload,
    _getFiles,
    _readRootHtmlFile
  }, true);
};

const validateConversioZipFile = async ({
  fileBaseName,
  directoryToUpload,
  _getFiles = FsService.getFiles,
  _readRootHtmlFile = FsService.readFileUTF8,
} = {}) => {
  return validateHTML({
    fileBaseName, directoryToUpload, _getFiles, _readRootHtmlFile
  });
}

const ValidatorService = {
  validateGWDZipFile,

  validateConversioZipFile,

  validateFile: async ({ fileBaseName, directoryToUpload, exporter }) => {
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
  },
};

export default ValidatorService;
