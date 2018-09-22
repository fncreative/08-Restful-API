'use strict';

const superAgent = require('superagent');
const server = require('../lib/server');

describe('/api/WinLoss', () => {
  beforeAll(server.start);

  test('should respond with 200 status code and a new json game record', () => {
    return superAgent.post('http://localhost:3000/api/winloss')
      .set('Content-Type', 'application/json')
      .send({
        awayTeam: 'Seahawks',
        homeTeam: 'Bears',
        score: '24-27',
        winLoss: 'Loss',
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.awayTeam).toEqual('Seahawks');
        expect(response.body.homeTeam).toEqual('Bears');
        expect(response.body.score).toEqual('24-27');
        expect(response.body.winLoss).toEqual('Loss');

        expect(response.body.timestamp).toBeTruthy();
        expect(response.body.id).toBeTruthy();
      });
  });
  test('should respond with 400 status code if there is no away team', () => {
    return superAgent.post('http://localhost:3000/api/winloss')
      .set('Content-Type', 'application/json')
      .send({
        awayTeam: 'Seahawks',
      })
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });
});
