'use strict';

const url = require('url');
const queryString = require('querystring');
const logger = require('./logger');

const requestParser = module.exports = {};

/**
 * Request parser WILL parse the bodies of POST and PUT requests.
 * @param request
 * @returns {Promise<any>}
 */
requestParser.parseAsync = (request) => {
  // a function to return a new promise so that the parse may be completed elsewhere
  return new Promise((resolve, reject) => {
    logger.log(logger.INFO, `Original URL: ${request.url}`);

    request.url = url.parse(request.url);
    request.url.query = queryString.parse(request.url.query);

    if (request.method !== 'POST' && request.method !== 'PUT') {
      return resolve(request);
    }
    let completeBody = '';
    // needed as the data comes in chunks
    request.on('data', (buffer) => {
      completeBody += buffer.toString();
    });

    // once all of the chunks are received this fires
    request.on('end', () => {
      try {
        // body property added as it is the same way that it works in Express
        request.body = JSON.parse(completeBody);
        return resolve(request);
      } catch (error) {
        // You must either return or reject here
        return reject(error);
      }
    });
    return undefined;
  });
};
