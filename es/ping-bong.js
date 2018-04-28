#!/usr/bin/env node

const axios = require('axios');
const debug = require('debug')('ping-bong');
const { name, version } = require('../package.json');

const bongAgent = `${name}/${version}`;

module.exports = async function pingBong({
  method = 'head',
  url,
  userAgent = bongAgent,
  redirections = [],
} = {}) {
  try {
    const requestOptions = {
      method,
      url,
      maxRedirects: 0,
      headers: {
        'User-Agent': userAgent,
      },
    };

    const { status: statusCode, statusText } = await axios.request(requestOptions);

    debug('%s %s: %s (%d)', method.toUpperCase(), url, statusText, statusCode);

    redirections.push({ url, statusCode });

    return redirections;
  } catch (error) {
    const { status: statusCode, statusText, headers } = error.response || {};

    debug('%s %s: %s (%d)', method.toUpperCase(), url, statusText, statusCode);

    if (statusCode >= 300 && statusCode < 400) {
      const { location: to } = headers;

      redirections.push({ to, statusCode });

      debug('Following "%s"...', to);

      return pingBong({
        method,
        url: to,
        userAgent,
        redirections,
      });
    }

    redirections.push({ error: { statusCode, statusText, msg: error.message }, url });

    return redirections;
  }
};
