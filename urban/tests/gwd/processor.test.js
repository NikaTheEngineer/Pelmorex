import { expect } from 'chai';
import _ from 'lodash';

import ProcessorService from '../../modules/processor/processor.service.js';

const GWDProcessorTests = {
  shouldProcessAllUrlsWithMacro: () => {
    const rawSingleUrlBody = `
                  <script type="text/javascript" gwd-events="handlers">
                      gwd.auto_Btn_Exit_1Action = function(event) {
                          // GWD Predefined Function
                          gwd.actions.gwdGoogleAd.exit('gwd-ad', 'Btn-Exit', 'http://www.google.com/', true, true);
                      };
                  </script>
              `;
    const processedSingleUrlBody = `
                  <script type="text/javascript" gwd-events="handlers">
                      gwd.auto_Btn_Exit_1Action = function(event) {
                          // GWD Predefined Function
                          gwd.actions.gwdGoogleAd.exit('gwd-ad', 'Btn-Exit', decodeURIComponent(window.location.href.split('?adserver=')[1]) + "http://www.google.com/", true, true);
                      };
                  </script>
              `;
    const rawMultiUrlBody = `
                  <script type="text/javascript" gwd-events="handlers">
                      gwd.auto_Btn_Exit_1Action = function(event) {
                          gwd.actions.gwdGoogleAd.exit('gwd-ad', 'Btn-Exit', 'https://www.google.com/', true, true);
                      };
                      gwd.auto_Btn_Exit_2Action = function(event) {
                          gwd.actions.gwdGoogleAd.exit('gwd-ad', 'Btn-Exit', 'https://www.google.ca', true, true);
                      };
                      gwd.auto_Btn_Exit_3Action = function(event) {
                          gwd.actions.gwdGoogleAd.exit('gwd-ad', 'Btn-Exit', 'https://www.google.co.uk', true, true);
                      };
                      gwd.auto_Btn_Exit_4Action = function(event) {
                          gwd.actions.gwdGoogleAd.exit('gwd-ad', 'Btn-Exit', 'https://google.org', true, true);
                      };
                      gwd.auto_Btn_Exit_5Action = function(event) {
                          gwd.actions.gwdGoogleAd.exit('gwd-ad', 'Btn-Exit', "https://google.org", true, true);
                      };
                  </script>
              `;
    const processedMultiUrlBody = `
                  <script type="text/javascript" gwd-events="handlers">
                      gwd.auto_Btn_Exit_1Action = function(event) {
                          gwd.actions.gwdGoogleAd.exit('gwd-ad', 'Btn-Exit', decodeURIComponent(window.location.href.split('?adserver=')[1]) + "https://www.google.com/", true, true);
                      };
                      gwd.auto_Btn_Exit_2Action = function(event) {
                          gwd.actions.gwdGoogleAd.exit('gwd-ad', 'Btn-Exit', decodeURIComponent(window.location.href.split('?adserver=')[1]) + "https://www.google.ca", true, true);
                      };
                      gwd.auto_Btn_Exit_3Action = function(event) {
                          gwd.actions.gwdGoogleAd.exit('gwd-ad', 'Btn-Exit', decodeURIComponent(window.location.href.split('?adserver=')[1]) + "https://www.google.co.uk", true, true);
                      };
                      gwd.auto_Btn_Exit_4Action = function(event) {
                          gwd.actions.gwdGoogleAd.exit('gwd-ad', 'Btn-Exit', decodeURIComponent(window.location.href.split('?adserver=')[1]) + "https://google.org", true, true);
                      };
                      gwd.auto_Btn_Exit_5Action = function(event) {
                          gwd.actions.gwdGoogleAd.exit('gwd-ad', 'Btn-Exit', decodeURIComponent(window.location.href.split('?adserver=')[1]) + "https://google.org", true, true);
                      };
                  </script>
              `;

    expect(ProcessorService.processGWDClickthroughUrls(rawSingleUrlBody)).to.eql(processedSingleUrlBody);
    expect(ProcessorService.processGWDClickthroughUrls(rawMultiUrlBody)).to.eql(processedMultiUrlBody);
  },
};

export default GWDProcessorTests;
