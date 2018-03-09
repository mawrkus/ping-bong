#!/usr/bin/env node

const axios = require('axios');
const debug = require('debug')('ping');

async function ping({ url, redirections = [] } = {}) {
  try {
    const { status: statusCode, statusText } = await axios.request({
      method: 'head',
      url,
      maxRedirects: 0,
    });

    debug('HEAD %s: %s (%d)', url, statusText, statusCode);

    redirections.push({ statusCode, url });

    return redirections;
  } catch (error) {
    const { status: statusCode, statusText, headers } = error.response;
    const { location: to } = headers;

    debug('HEAD %s: %s (%d)', url, statusText, statusCode);

    if (statusCode >= 300 && statusCode < 400) {
      redirections.push({ statusCode, to });
      debug('Following "%s"...', to);
      return ping({ url: to, redirections });
    }

    redirections.push({ error: { statusCode, statusText }, url });

    return redirections;
  }
}

(async () => {
  const url = process.argv[2];
  const redirections = await ping({ url });
  console.log(JSON.stringify({ url, redirections }, null, 2));
})();
