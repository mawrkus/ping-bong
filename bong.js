#!/usr/bin/env node

const axios = require('axios');
const debug = require('debug')('ping');

module.exports = async function bong({ url, redirections = [] } = {}) {
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

    debug('HEAD %s: %s (%d)', url, statusText, statusCode);

    if (statusCode >= 300 && statusCode < 400) {
      const { location: to } = headers;

      redirections.push({ statusCode, to });

      debug('Following "%s"...', to);

      return bong({ url: to, redirections });
    }

    redirections.push({ error: { statusCode, statusText }, url });

    return redirections;
  }
}
