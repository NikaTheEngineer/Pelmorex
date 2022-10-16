import Lodash from 'lodash';

const trimUrl = url => {
  return Lodash.chain(url)
    .trim(`'`)
    .trim(`"`)
    .value();
};

const formatUrl = (url) => {
  const trimmedUrl = trimUrl(url);
  return `decodeURIComponent(window.location.href.split('?adserver=')[1]) + "${trimmedUrl}"`;
};

const processClickthroughUrls = (body, urlRegex, tagOrEventRegex, charAfterUrl) => {
  let output = body;

  Lodash.each(body.match(tagOrEventRegex), params => {
    const formattedParams = params.replace(urlRegex, (url) => {
      return charAfterUrl ? formatUrl(url.split(charAfterUrl)[0]) + charAfterUrl : formatUrl(url);
    });

    output = output.replace(params, formattedParams);
  });

  return output;
};

const processGWDClickthroughUrls = body => {
  const exitEventRegex = /.exit\([^\)]+\)/gm;
  const urlRegex = /(["']https?:\/\/[^\s]+["'],)/g;

  return processClickthroughUrls(body, urlRegex, exitEventRegex, ',');
};

const processConversioClickthroughUrls = body => {
  const clickTagRegex = /clickTag\s*=\s*["'](\S*)["']/gi;
  const urlRegex = /(["']https?:\/\/[^\s]+["'])/g;

  return processClickthroughUrls(body, urlRegex, clickTagRegex);
};

const processNewClickthroughUrls = body => {
  const clickTagRegex = /clickTag\s*=\s*["'](\S*)["']/gi;
  const urlRegex = /(["']https?:\/\/[^\s]+["'])/g;

  return processClickthroughUrls(body, urlRegex, clickTagRegex, ';');
};

const ProcessorService = {
  processGWDClickthroughUrls,

  processConversioClickthroughUrls,

  processNewClickthroughUrls,

  processClickthroughUrls: (body, exporter) => {
    switch (exporter) {
      case 'gwd':
        return processGWDClickthroughUrls(body);
      case 'conversio':
        return processConversioClickthroughUrls(body);
      default:
        return processGWDClickthroughUrls(body);
    }
  },
};

export default ProcessorService;
