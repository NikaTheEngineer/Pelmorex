import { expect } from 'chai';
import _ from 'lodash';
import sinon from 'sinon';

import ValidatorService from '../../modules/validator/validator.service.js';

const ConversioValidatorTests = {
  callsCorrectDependencies: async () => {
    const _getFiles = sinon.stub().returns(['testZipFile.html']);
    const _readRootHtmlFile = sinon
      .stub()
      .returns(`<meta name="generator" content="Google Web Designer"/>`);

    await ValidatorService.validateConversioZipFile({
      fileBaseName: 'testZipFile',
      directoryToUpload: 'testUploadDirectory',
      _getFiles,
      _readRootHtmlFile,
    });

    expect(_getFiles.called).to.eql(true);
    expect(_readRootHtmlFile.called).to.eql(true);
  },

  shouldAcceptValidFile: async () => {
    const _getFiles = sinon
      .stub()
      .returns(['conversio-test-a.html', 'images/test-image.png']);
    const _readRootHtmlFile = sinon.stub().returns(`
                <image src="images/test-image.png"/>
            `);

    const isValid = await ValidatorService.validateConversioZipFile({
      fileBaseName: 'conversio-test-a',
      directoryToUpload: 'testUploadDirectory',
      _getFiles,
      _readRootHtmlFile,
    });

    expect(isValid).to.eql(true);
  },

  shouldAcceptParensInFilename: async () => {
    const _getFiles = sinon
      .stub()
      .returns(['conversio-test-a.html', 'images/test-image.png']);
    const _readRootHtmlFile = sinon.stub().returns(`
                <image src="images/test-image.png"/>
            `);

    const isValid = await ValidatorService.validateConversioZipFile({
      fileBaseName: 'conversio-test-a (1)',
      directoryToUpload: 'testUploadDirectory',
      _getFiles,
      _readRootHtmlFile,
    });

    expect(isValid).to.eql(true);
  },

  shouldRejectMissingRootFile: async () => {
    const _getFiles = sinon.stub().returns([]);
    const _readRootHtmlFile = sinon.stub().returns(`<meta/>`);
    let isValid;

    try {
      isValid = await ValidatorService.validateConversioZipFile({
        fileBaseName: 'conversio-test-a',
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
    const _getFiles = sinon.stub().returns(['conversio-test-a.html']);
    const _readRootHtmlFile = sinon.stub().returns('');
    let isValid;

    try {
      isValid = await ValidatorService.validateConversioZipFile({
        fileBaseName: 'conversio-test-a',
        directoryToUpload: 'testUploadDirectory',
        _getFiles,
        _readRootHtmlFile,
      });
    } catch (err) {
      expect(err.message).to.eql('Root .html file is missing content');
    }

    expect(isValid).to.eql(undefined);
  },

  shouldRejectRootFileameNotInZipFilename: async () => {
    const _getFiles = sinon
      .stub()
      .returns(['conversio-test-b.html', 'images/test-image.png']);
    const _readRootHtmlFile = sinon.stub().returns(`
                <image src="images/test-image.png"/>
            `);
    let isValid;

    try {
      isValid = await ValidatorService.validateConversioZipFile({
        fileBaseName: 'conversio-test-a (1)',
        directoryToUpload: 'testUploadDirectory',
        _getFiles,
        _readRootHtmlFile,
      });
    } catch (err) {
      expect(err.message).to.eql(
        `Zip file name 'conversio-test-a (1)' does not contain basename 'conversio-test-b'`
      );
    }

    expect(isValid).to.eql(undefined);
  },
};

export default ConversioValidatorTests;
