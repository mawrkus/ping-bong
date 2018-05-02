#!/usr/bin/env node

const axios = require('axios');
const debug = require('debug')('ping-bong');
const { name: pkgName, version: pkgVersion } = require('../package.json');

/**
 * @param  {AxiosResponse} response
 * @return {boolean}
 */
function isRedirection(response) {
  const { status } = response;
  return (status >= 300 && status < 400);
}

/**
 * @param {AxiosResponse} response
 */
function logResponse({ config = {}, status = '?', statusText = '?' /* , headers */ }) {
  const { method = '?', url = '?' } = config;
  debug('%s %s: %s (%d)', method.toUpperCase(), url, statusText, status);
  // debug(headers);
}

/**
 * @param {AxiosRequest} request
 */
function logRequest({ method, url/* , headers */ }) {
  debug('%s %s...', method.toUpperCase(), url);
  // debug(headers);
}

/**
 * @param  {Object} httpOptions
 * @return {HttpClient}
 */
function createHttpClient(httpOptions) {
  const httpClient = axios.create({
    ...httpOptions,
    maxRedirects: 0,
  });

  httpClient.interceptors.request.use((config) => {
    logRequest(config);
    return config;
  }, async (error) => {
    debug('Request error!');
    debug(error);
    throw error;
  });

  httpClient.interceptors.response.use((response) => {
    logResponse(response);
    return response;
  }, async (error) => {
    const { response = {} } = error;
    logResponse(response);
    throw error;
  });

  // debug('HTTP client created');
  // debug(httpClient.defaults);

  return httpClient;
}

module.exports = class PingBong {
  /**
   * @param {Object} [httpOptions]
   * @param {String} [httpOptions.method='head']
   * @param {Object} [httpOptions.headers]
   * @param {string} [httpOptions.headers.User-Agent]
   * @param {Object} [includes]
   * @param {Object} [includes.request]
   * @param {Object} [includes.response]
   */
  constructor({
    httpOptions = {
      method: 'head',
      headers: {
        'User-Agent': `${pkgName}/${pkgVersion}`,
      },
    },
    includes = {
      request: {
        method: true,
        url: true,
        headers: false,
      },
      response: {
        status: true,
        statusText: true,
        headers: false,
        data: false,
      },
    },
  } = {}) {
    debug('🏓  %s v%s', pkgName, pkgVersion);
    debug('HTTP options', httpOptions);
    debug('Includes', includes);

    this._httpClient = createHttpClient(httpOptions);
    this._httpOptions = httpOptions;
    this._includes = includes;
  }

  /**
   * @param  {string}  url
   * @return {Promise.<Object[]>}
   */
  async check({ url }) {
    const redirections = [];
    let currentUrl = url;

    do {
      /* eslint-disable no-await-in-loop */
      try {
        const response = await this._httpClient.request({ url: currentUrl });

        const finalRedirection = this._grabRedirection({ response });

        redirections.push(finalRedirection);

        currentUrl = null;
      } catch (error) {
        const { response = {} } = error;

        const redirection = {
          // just in case an error occurs before having a response
          url: currentUrl,
          ...this._grabRedirection({ response }),
        };

        if (isRedirection(response)) {
          const { location: to } = response.headers;
          redirection.to = to;
          currentUrl = to;
        } else {
          redirection.error = error.message;
          currentUrl = null;
        }

        redirections.push(redirection);
      }
      /* eslint-enable no-await-in-loop */
    } while (currentUrl);

    return redirections;
  }

  /**
   * @param  {AxiosResponse} response
   * @return {Object}
   */
  _grabRedirection({ response }) {
    const { config: request = {} } = response;
    const redirection = {};

    Object.keys(this._includes.request)
      .filter(key => this._includes.request[key] && request[key])
      .forEach((key) => {
        redirection[key] = request[key];
      });

    Object.keys(this._includes.response)
      .filter(key => this._includes.response[key] && response[key])
      .forEach((key) => {
        redirection[key] = response[key];
      });

    return redirection;
  }
};
