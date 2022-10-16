import { expect } from 'chai';
import _ from 'lodash';
import sinon from 'sinon';

import ValidatorService from '../../modules/validator/validator.service.js';

const GWDValidatorTests = {
  callsCorrectDependencies: async () => {
    const _getFiles = sinon.stub().returns(['testZipFile.html']);
    const _readRootHtmlFile = sinon
      .stub()
      .returns(`<meta name="generator" content="Google Web Designer"/>`);

    await ValidatorService.validateGWDZipFile({
      fileBaseName: 'testZipFile',
      directoryToUpload: 'testUploadDirectory',
      _getFiles,
      _readRootHtmlFile,
    });

    expect(_getFiles.called).to.eql(true);
    expect(_readRootHtmlFile.called).to.eql(true);
  },

  shouldAcceptValidFile: async () => {
    const _getFiles = sinon.stub().returns(['gwd-test-a.html', 'assets/test-image.png']);
    const _readRootHtmlFile = sinon.stub().returns(`
                <meta name="generator" content="Google Web Designer"/>
                <image src="assets/test-image.png"/>
            `);

    const isValid = await ValidatorService.validateGWDZipFile({
      fileBaseName: 'gwd-test-a',
      directoryToUpload: 'testUploadDirectory',
      _getFiles,
      _readRootHtmlFile,
    });

    expect(isValid).to.eql(true);
  },

  shouldAcceptParensInFilename: async () => {
    const _getFiles = sinon.stub().returns(['gwd-test-a.html', 'assets/test-image.png']);
    const _readRootHtmlFile = sinon.stub().returns(`
                <meta name="generator" content="Google Web Designer"/>
                <image src="assets/test-image.png"/>
            `);

    const isValid = await ValidatorService.validateGWDZipFile({
      fileBaseName: 'gwd-test-a (1)',
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
      .returns(`<meta name="generator" content="Google Web Designer"/>`);
    let isValid;

    try {
      isValid = await ValidatorService.validateGWDZipFile({
        fileBaseName: 'gwd-test-a',
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
    const _getFiles = sinon.stub().returns(['gwd-test-a.html']);
    const _readRootHtmlFile = sinon.stub().returns('');
    let isValid;

    try {
      isValid = await ValidatorService.validateGWDZipFile({
        fileBaseName: 'gwd-test-a',
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
    const _getFiles = sinon.stub().returns(['gwd-test-a.html']);
    const _readRootHtmlFile = sinon.stub().returns('<meta/>');
    let isValid;

    try {
      isValid = await ValidatorService.validateGWDZipFile({
        fileBaseName: 'gwd-test-a',
        directoryToUpload: 'testUploadDirectory',
        _getFiles,
        _readRootHtmlFile,
      });
    } catch (err) {
      expect(err.message).to.eql(
        'Root .html file does not contain Google Web Designer metadata'
      );
    }

    expect(isValid).to.eql(undefined);
  },

  shouldRejectMissingAssetsFolder: async () => {
    const _getFiles = sinon.stub().returns(['gwd-test-a.html']);
    const _readRootHtmlFile = sinon.stub().returns(`
                <meta name="generator" content="Google Web Designer"/>
                <image src="assets/test-image.png"/>
            `);
    let isValid;

    try {
      isValid = await ValidatorService.validateGWDZipFile({
        fileBaseName: 'gwd-test-a',
        directoryToUpload: 'testUploadDirectory',
        _getFiles,
        _readRootHtmlFile,
      });
    } catch (err) {
      expect(err.message).to.eql('Zip file is missing assets folder for linked assets');
    }

    expect(isValid).to.eql(undefined);
  },

  shouldRejectRootFileameNotInZipFilename: async () => {
    const _getFiles = sinon.stub().returns(['gwd-test-b.html', 'assets/test-image.png']);
    const _readRootHtmlFile = sinon.stub().returns(`
                <meta name="generator" content="Google Web Designer"/>
                <image src="assets/test-image.png"/>
            `);
    let isValid;

    try {
      isValid = await ValidatorService.validateGWDZipFile({
        fileBaseName: 'gwd-test-a (1)',
        directoryToUpload: 'testUploadDirectory',
        _getFiles,
        _readRootHtmlFile,
      });
    } catch (err) {
      expect(err.message).to.eql(
        `Zip file name 'gwd-test-a (1)' does not contain basename 'gwd-test-b'`
      );
    }

    expect(isValid).to.eql(undefined);
  },
};

export default GWDValidatorTests;