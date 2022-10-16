import _ from 'lodash';

import GWDValidatorTests from './tests/gwd/validator.spec.js';
import ConversioValidatorTests from './tests/conversio/validator.test.js';
import SizeValidatorTests from './tests/size/validator.test.js';

import GWDProcessorTests from './tests/gwd/processor.test.js';
import ConversioProcessorTests from './tests/conversio/processor.test.js';
import NewProcessorTests from './tests/new/processor.test.js';

describe('campaign creatives zip file upload validators', () => {
  describe('validateGWDZipFile', () => {
    it('calls correct dependencies for gwd zip upload', GWDValidatorTests.callsCorrectDependencies);

    it('should accept valid gwd zip files', GWDValidatorTests.shouldAcceptValidFile);

    it('should accept valid gwd zip files with parens in file name', GWDValidatorTests.shouldAcceptParensInFilename);

    it('should reject zip file with missing root html file', GWDValidatorTests.shouldRejectMissingRootFile);

    it('should reject zip file where root html file is missing content', GWDValidatorTests.shouldRejectMissingContent);

    it('should reject zip file where root html file does not contain GWD metadata', GWDValidatorTests.shouldRejectMissingMetadata);

    it('should reject zip file where assets folder is missing for linked assets', GWDValidatorTests.shouldRejectMissingAssetsFolder);

    it('should reject zip file where root html file base name is not in zip file base name', GWDValidatorTests.shouldRejectRootFileameNotInZipFilename);
  });

  describe('validateConversioZipFile', () => {
    it('calls correct dependencies for conversio zip upload', ConversioValidatorTests.callsCorrectDependencies);

    it('should accept valid conversio zip files', ConversioValidatorTests.shouldAcceptValidFile);

    it('should accept valid conversio zip files with parens in file name', ConversioValidatorTests.shouldAcceptParensInFilename);

    it('should reject zip file with missing root html file', ConversioValidatorTests.shouldRejectMissingRootFile);

    it('should reject zip file where root html file is missing content', ConversioValidatorTests.shouldRejectMissingContent);

    it('should reject zip file where root html file base name is not in zip file base name', ConversioValidatorTests.shouldRejectRootFileameNotInZipFilename);
  });

  describe('validateAdSize', () => {
    it('calls correct dependencies for html with size tag zip upload', SizeValidatorTests.callsCorrectDependencies);

    it('should accept valid html with size tag zip files', SizeValidatorTests.shouldAcceptValidFile);

    it('should accept valid html with size tag zip files with parens in file name', SizeValidatorTests.shouldAcceptParensInFilename);

    it('should reject zip file with missing root html file', SizeValidatorTests.shouldRejectMissingRootFile);

    it('should reject zip file where root html file is missing content', SizeValidatorTests.shouldRejectMissingContent);

    it('should reject zip file where root html file does not contain ad.size metadata', SizeValidatorTests.shouldRejectMissingMetadata);
  });

  describe('processGWDClickthroughUrls', () => {
    it('should process all clickthrough urls with a redirect macro', GWDProcessorTests.shouldProcessAllUrlsWithMacro);
  });

  describe('processConversioClickthroughUrls', () => {
    it('should process all clickthrough urls with a redirect macro', ConversioProcessorTests.shouldProcessAllUrlsWithMacro);
  });

  describe('processNewClickthroughUrls', () => {
    it('should process all clickthrough urls with a redirect macro', NewProcessorTests.shouldProcessAllUrlsWithMacro);
  });
});