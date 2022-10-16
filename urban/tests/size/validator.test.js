import { expect } from 'chai';
import _ from 'lodash';
import sinon from 'sinon';

import ValidatorService from '../../modules/validator/validator.service.js';

const SizeValidatorTests = {
  callsCorrectDependencies: async () => {
    const _getFiles = sinon.stub().returns(['testZipFile.html']);
    const _readRootHtmlFile = sinon
      .stub()
      .returns(`<meta name="ad.size" content="width=[12],height=[12]">`);

    await ValidatorService.validateAdSizeZipFile({
      fileBaseName: 'testZipFile',
      directoryToUpload: 'testUploadDirectory',
      _getFiles,
      _readRootHtmlFile,
    });

    expect(_getFiles.called).to.eql(true);
    expect(_readRootHtmlFile.called).to.eql(true);
  },

  shouldAcceptValidFile: async () => {
    const _getFiles = sinon.stub().returns(['test-a.html']);
    const _readRootHtmlFile = sinon.stub().returns(`
                <meta name="ad.size" content="width=[12],height=[12]">
            `);

    const isValid = await ValidatorService.validateAdSizeZipFile({
      fileBaseName: 'test-a',
      directoryToUpload: 'testUploadDirectory',
      _getFiles,
      _readRootHtmlFile,
    });

    expect(isValid).to.eql(true);
  },

  shouldAcceptParensInFilename: async () => {
    const _getFiles = sinon.stub().returns(['test-a.html']);
    const _readRootHtmlFile = sinon.stub().returns(`
                <meta name="ad.size" content="width=[12],height=[12]">
            `);

    const isValid = await ValidatorService.validateAdSizeZipFile({
      fileBaseName: 'test-a (1)',
      directoryToUpload: 'testUploadDirectory',
      _getFiles,
      _readRootHtmlFile,
    });

    expect(isValid).to.eql(true);
  },

  shouldRejectMissingRootFile: async () => {
    const _getFiles = sinon.stub().returns([]);
    const _readRootHtmlFile = sinon
      .stub()
      .returns(`<meta name="ad.size" content="width=[12],height=[12]">`);
    let isValid;

    try {
      isValid = await ValidatorService.validateAdSizeZipFile({
        fileBaseName: 'test-a',
        directoryToUpload: 'testUploadDirectory',
        _getFiles,
        _readRootHtmlFile,
      });
    } catch (err) {
      expect(err.message).to.eql('Zip file does not contain a root .html file');
    }

    expect(isValid).to.eql(undefined);
  },

  shouldRejectMissingContent: async () => {
    const _getFiles = sinon.stub().returns(['test-a.html']);
    const _readRootHtmlFile = sinon.stub().returns('');
    let isValid;

    try {
      isValid = await ValidatorService.validateAdSizeZipFile({
        fileBaseName: 'test-a',
        directoryToUpload: 'testUploadDirectory',
        _getFiles,
        _readRootHtmlFile,
      });
    } catch (err) {
      expect(err.message).to.eql('Root .html file is missing content');
    }

    expect(isValid).to.eql(undefined);
  },

  shouldRejectMissingMetadata: async () => {
    const _getFiles = sinon.stub().returns(['test-a.html']);
    const _readRootHtmlFile = sinon.stub().returns('<meta/>');
    let isValid;

    try {
      isValid = await ValidatorService.validateAdSizeZipFile({
        fileBaseName: 'test-a',
        directoryToUpload: 'testUploadDirectory',
        _getFiles,
        _readRootHtmlFile,
      });
    } catch (err) {
      expect(err.message).to.eql(
        'Root .html file does not contain ad size meta tag'
      );
    }

    expect(isValid).to.eql(undefined);
  },
};

export default SizeValidatorTests;
