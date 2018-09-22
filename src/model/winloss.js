'use strict';

const uuid = require('uuid/v1');

class WinTracker {
  constructor(team, team2, score, winLoss) {
    this.id = uuid();
    this.timestamp = new Date();
    this.awayTeam = team;
    this.homeTeam = team2;
    this.score = score;
    this.winLoss = winLoss;
  }
}

module.exports = WinTracker;
