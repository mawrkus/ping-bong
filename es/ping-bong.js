#!/usr/bin/env node

const axios = require('axios');
const get = require('lodash.get');
const set = require('lodash.set');
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
    maxRedirects: 0, // no follow
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
   */
  constructor({
    httpOptions = {
      method: 'head',
      headers: {
        'user-agent': `${pkgName}/${pkgVersion}`,
      },
      maxRedirects: 10,
    },
    includes = {
      'request.method': 'method',
      'request.url': 'url',
      'response.headers.location': 'to',
      'response.status': 'statusCode',
      'response.statusText': 'statusText',
      'response.responseTime': 'responseTime',
      'request.headers.user-agent': 'userAgent',
    },
  } = {}) {
    debug('🏓  %s v%s', pkgName, pkgVersion);

    const { maxRedirects } = httpOptions;
    this._maxRedirects = Number(maxRedirects) >= 0 ? Number(maxRedirects) : 10;

    this._httpOptions = { ...httpOptions };
    delete this._httpOptions.maxRedirects;

    this._httpClient = createHttpClient(httpOptions);

    this._includes = { ...includes };

    debug('HTTP options', this._httpOptions);
    debug('Max redirects =', this._maxRedirects);
    debug('Includes', this._includes);
  }

  /**
   * @param  {string}  url
   * @return {Promise.<Object[]>}
   */
  async check({ url }) {
    const redirections = [];
    let currentUrl = url;
    let remainingRedirects = this._maxRedirects;

    /* eslint-disable no-await-in-loop */
    do {
      const start = Date.now();

      try {
        const response = await this._httpClient.request({ url: currentUrl });

        response.responseTime = Date.now() - start;

        const finalRedirection = this._grabRedirection({ response });

        redirections.push(finalRedirection);

        currentUrl = null;
      } catch (error) {
        const { response = { statusText: 'error' } } = error;

        response.responseTime = Date.now() - start;

        const redirection = this._grabRedirection({ response });

        if (isRedirection(response)) {
          debug('Max %d redirect(s) to follow.', remainingRedirects);
          remainingRedirects -= 1;
          currentUrl = response.headers.location;
        } else {
          redirection.url = currentUrl;
          redirection.error = error.message;
          currentUrl = null;
        }

        redirections.push(redirection);
      }
    } while (currentUrl && remainingRedirects >= 0);
    /* eslint-enable no-await-in-loop */

    return redirections;
  }

  /**
   * @param  {AxiosResponse} response
   * @return {Object}
   */
  _grabRedirection({ response }) {
    const syntheticResponse = {
      request: response.config,
      response,
    };
    const redirection = {};

    Object.entries(this._includes)
      .forEach(([from, to]) => {
        const value = get(syntheticResponse, from);
        set(redirection, to, value);
      });

    return redirection;
  }
};
