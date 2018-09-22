'use strict';

const WinTracker = require('../model/winloss');
const app = require('../lib/router');
const logger = require('../lib/logger');

const winLossStorage = [];

const sendStatus = (statusCode, message, response) => {
  logger.log(logger.INFO, `Responding with a ${statusCode} status code due to ${message}`);
  response.writeHead(statusCode);
  response.end();
};

const sendJSON = (statusCode, data, response) => {
  logger.log(logger.INFO, `Responding with a ${statusCode} status and the following data`);
  logger.log(logger.INFO, JSON.stringify(data));

  response.writeHead(statusCode, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(data));
  response.end();
};

app.post('/api/winloss', (request, response) => {
  // validation of the request
  if (!request.body) {
    sendStatus(400, 'body not found', response);
    return undefined;
  }

  if (!request.body.awayTeam) {
    sendStatus(400, 'title not found', response);
    return undefined;
  }

  if (!request.body.homeTeam) {
    sendStatus(400, 'content not found', response);
    return undefined;
  }

  const outcome = new WinTracker(request.body.awayTeam, request.body.homeTeam,
    request.body.score, request.body.winLoss);
  winLossStorage.push(outcome);
  sendJSON(200, outcome, response);
  return undefined;
});
