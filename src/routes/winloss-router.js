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
    sendStatus(400, 'that game is not found', response);
    return undefined;
  }

  if (!request.body.awayTeam) {
    sendStatus(400, 'away team is not found', response);
    return undefined;
  }

  if (!request.body.homeTeam) {
    sendStatus(400, 'home team not found', response);
    return undefined;
  }

  const outcome = new WinTracker(request.body.awayTeam, request.body.homeTeam,
    request.body.score, request.body.winLoss);
  winLossStorage.push(outcome);
  sendJSON(200, outcome, response);
  return undefined;
});

app.get('/api/winloss/', (request, response) => {
  sendStatus(200, 'This path exists on the server', response);
  return undefined;
});

// app.get('/api/v1/getall', (request, response) => {
//
// });

app.delete('/api/winloss/', (request, response) => {
  winLossStorage.splice(winLossStorage.indexOf(request.url.query(request)), 1);
  sendStatus(204, `${request.url.query(request)} no longer exists. Did you not like the outcome?`, response);
  return undefined;
});
