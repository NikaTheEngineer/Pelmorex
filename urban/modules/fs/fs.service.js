import fs from 'fs';
import path from 'path';

import FsConstants from './fs.constants.js';

const deleteFolderRecursively = folderPath => {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach(file => {
      const currentPath = path.join(folderPath, file);

      if (fs.lstatSync(currentPath).isDirectory()) {
        deleteFolderRecursively(currentPath);
      } else {
        fs.unlinkSync(currentPath);
      }
    });
    fs.rmdirSync(folderPath);
  }
};

const FsService = {
  persistTempFolders: () => {
    if (!fs.existsSync(FsConstants.TEMP_DIRECTORY)) {
      fs.mkdirSync(FsConstants.TEMP_DIRECTORY);
    }

    if (!fs.existsSync(FsConstants.UPLOAD_DIRECTORY)) {
      fs.mkdirSync(FsConstants.UPLOAD_DIRECTORY);
    }

    if (!fs.existsSync(FsConstants.EXTRACT_DIRECTORY)) {
      fs.mkdirSync(FsConstants.EXTRACT_DIRECTORY);
    }
  },

  getFiles: async directoryPath => {
    return fs.existsSync(directoryPath) ? fs.readdir(directoryPath) : [];
  },

  readFileUTF8: file => {
    return fs.readFileSync(file, 'utf8');
  },

  readFile: file => {
    return fs.readFileSync(file);
  },

  removeTempFolders: () => {
    deleteFolderRecursively(FsConstants.UPLOAD_DIRECTORY);
    deleteFolderRecursively(FsConstants.EXTRACT_DIRECTORY);
  },
}

export default FsService;
