import { expect } from 'chai';
import _ from 'lodash';

import ProcessorService from '../../modules/processor/processor.service.js';

const NewProcessorTests = {
  shouldProcessAllUrlsWithMacro: () => {
    const expectedOutputWithVar = `
                <script>
                    var clickTag = decodeURIComponent(window.location.href.split('?adserver=')[1]) + "https://www.google.com";
                </script>
            `;
    const expectedOutputWithLet = `
                <script>
                    let clickTag = decodeURIComponent(window.location.href.split('?adserver=')[1]) + "https://www.google.com";
                </script>
            `;
    const expectedOutputWithConst = `
                <script>
                    const clickTag = decodeURIComponent(window.location.href.split('?adserver=')[1]) + "https://www.google.com";
                </script>
            `;
    const expectedOutputWithCase = `
                <script>
                    var ClickTAG = decodeURIComponent(window.location.href.split('?adserver=')[1]) + "https://www.google.com";
                </script>
            `;
    const expectedOutputWithSpace = `
                <script>
                    var clickTag  =  decodeURIComponent(window.location.href.split('?adserver=')[1]) + "https://www.google.com";
                </script>
            `;
    const expectedOutputWithNoSpace = `
                <script>
                    var clickTag=decodeURIComponent(window.location.href.split('?adserver=')[1]) + "https://www.google.com";
                </script>
            `;

    expect(
      ProcessorService.processNewClickthroughUrls(`
                <script>
                    var clickTag = "https://www.google.com"
                </script>
            `)
    ).to.eql(expectedOutputWithVar);

    expect(
      ProcessorService.processNewClickthroughUrls(`
                <script>
                    var clickTag = 'https://www.google.com'
                </script>
            `)
    ).to.eql(expectedOutputWithVar);

    expect(
      ProcessorService.processNewClickthroughUrls(`
                <script>
                    let clickTag = "https://www.google.com"
                </script>
            `)
    ).to.eql(expectedOutputWithLet);

    expect(
      ProcessorService.processNewClickthroughUrls(`
                <script>
                    const clickTag = "https://www.google.com"
                </script>
            `)
    ).to.eql(expectedOutputWithConst);

    expect(
      ProcessorService.processNewClickthroughUrls(`
                <script>
                    var ClickTAG = "https://www.google.com"
                </script>
            `)
    ).to.eql(expectedOutputWithCase);

    expect(
      ProcessorService.processNewClickthroughUrls(`
                <script>
                    var clickTag  =  "https://www.google.com"
                </script>
            `)
    ).to.eql(expectedOutputWithSpace);

    expect(
      ProcessorService.processNewClickthroughUrls(`
                <script>
                    var clickTag="https://www.google.com"
                </script>
            `)
    ).to.eql(expectedOutputWithNoSpace);
  },
};

export default NewProcessorTests;
