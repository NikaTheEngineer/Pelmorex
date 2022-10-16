import { expect } from 'chai';
import _ from 'lodash';

import ProcessorService from '../../modules/processor/processor.service.js';

const ConversioProcessorTests = {
  shouldProcessAllUrlsWithMacro: () => {
    const expectedOutputWithVar = `
                <script>
                    var clickTag = decodeURIComponent(window.location.href.split('?adserver=')[1]) + "http://plancherspayless.com/fr/"
                </script>
            `;
    const expectedOutputWithLet = `
                <script>
                    let clickTag = decodeURIComponent(window.location.href.split('?adserver=')[1]) + "http://plancherspayless.com/fr/"
                </script>
            `;
    const expectedOutputWithConst = `
                <script>
                    const clickTag = decodeURIComponent(window.location.href.split('?adserver=')[1]) + "http://plancherspayless.com/fr/"
                </script>
            `;
    const expectedOutputWithCase = `
                <script>
                    var ClickTAG = decodeURIComponent(window.location.href.split('?adserver=')[1]) + "http://plancherspayless.com/fr/"
                </script>
            `;
    const expectedOutputWithSpace = `
                <script>
                    var clickTag  =  decodeURIComponent(window.location.href.split('?adserver=')[1]) + "http://plancherspayless.com/fr/"
                </script>
            `;
    const expectedOutputWithNoSpace = `
                <script>
                    var clickTag=decodeURIComponent(window.location.href.split('?adserver=')[1]) + "http://plancherspayless.com/fr/"
                </script>
            `;

    expect(
      ProcessorService.processConversioClickthroughUrls(`
                <script>
                    var clickTag = "http://plancherspayless.com/fr/"
                </script>
            `)
    ).to.eql(expectedOutputWithVar);

    expect(
      ProcessorService.processConversioClickthroughUrls(`
                <script>
                    var clickTag = 'http://plancherspayless.com/fr/'
                </script>
            `)
    ).to.eql(expectedOutputWithVar);

    expect(
      ProcessorService.processConversioClickthroughUrls(`
                <script>
                    let clickTag = "http://plancherspayless.com/fr/"
                </script>
            `)
    ).to.eql(expectedOutputWithLet);

    expect(
      ProcessorService.processConversioClickthroughUrls(`
                <script>
                    const clickTag = "http://plancherspayless.com/fr/"
                </script>
            `)
    ).to.eql(expectedOutputWithConst);

    expect(
      ProcessorService.processConversioClickthroughUrls(`
                <script>
                    var ClickTAG = "http://plancherspayless.com/fr/"
                </script>
            `)
    ).to.eql(expectedOutputWithCase);

    expect(
      ProcessorService.processConversioClickthroughUrls(`
                <script>
                    var clickTag  =  "http://plancherspayless.com/fr/"
                </script>
            `)
    ).to.eql(expectedOutputWithSpace);

    expect(
      ProcessorService.processConversioClickthroughUrls(`
                <script>
                    var clickTag="http://plancherspayless.com/fr/"
                </script>
            `)
    ).to.eql(expectedOutputWithNoSpace);
  },
};

export default ConversioProcessorTests;
