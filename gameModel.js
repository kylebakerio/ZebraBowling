
GameModel = {};

// Creates a new game object, which contains a 'players' object property,
// which contains a 'rounds' array property, which contains subarrays 
// for every around, which by default contain functions for every roll
// that return "-".

GameModel.games = [];

GameModel.new = function (names) {
  var games = this.games;

  var game = { players: [], nextRoll: {gameID: games.length, player: 0, round: 0, roll: 0} };

  names.forEach( (name) => { 
    var emptyRounds = [];
    for (var i = 0; i < 10; i++) {
      emptyRounds.push([() => {return "-"},() => {return "-"}])
    }
    game["players"].push( {"name": name, "rounds": emptyRounds} )
  });

  games.push(game);

  return games.length-1; 
}

GameModel.updateScore = function (gameID, player, round, roll, pins) {
  var games = this.games;

  // console.log(games[gameID].players[player].name + ", round " + round + ", roll " + roll + ": " + pins)
  
  // forbids higher total pin counts than 10 between two rolls in a round, unless final round
  if (roll === 1 && (games[gameID].players[player].rounds[round][0]() + pins > 10)) {
    // if this isn't first bonus roll of a strike in round 9
    if ( round !== 9 || (round === 9 && games[gameID].players[player].rounds[9][0]() !== 10) ) {
      // reduce to max legall playable for this roll
      pins = 10 - games[gameID].players[player].rounds[round][0]();
    }
  }

  // edge case:
  // forbids higher total pin counts than 10 between two bonus rolls in final round, 
  // unless the first bonus roll was also a strike, or third is bonus from spare.
  else if ( round === 9 && roll === 2 && 
    (games[gameID].players[player].rounds[round][1]() < 10) &&
    (games[gameID].players[player].rounds[round][1]() + pins > 10) &&
    (games[gameID].players[player].rounds[round][0]() + games[gameID].players[player].rounds[round][1]() !== 10)) {
      pins = 10 - games[gameID].players[player].rounds[round][1]();
  }

  // within the array for this round, assign the index that corresponds to this 
  // 'roll' to a function that returns the face value when called
  games[gameID].players[player].rounds[round][roll] = () => {return pins};

  // if this is a strike
  if (roll === 0 && pins === 10) {
    if (round !== 9) {
      // redefine second roll in this round as function that returns 
      // bonus ball 1 OR "?" if not yet played
      games[gameID].players[player].rounds[round][1] = 
        () => {
          return typeof games[gameID].players[player].rounds[round+1][0]() === "number" ?
            games[gameID].players[player].rounds[round+1][0]() : "?";
        }

      // add third function into this round that returns bonus ball 2 OR 
      // "?" if not yet played
      games[gameID].players[player].rounds[round][2] = 
        () => {
          return typeof games[gameID].players[player].rounds[round+1][1]() === "number" ?
            games[gameID].players[player].rounds[round+1][1]() : "?";
        }
    } // else will be handled by findNextRoll
  }

  // if this is a spare
  else if (roll === 1 && games[gameID].players[player].rounds[round][0]() + games[gameID].players[player].rounds[round][1]() === 10) {
    if (round !== 9) {
      // push function into this round that returns bonus ball 1 OR "?" if not yet played
      games[gameID].players[player].rounds[round][2] =
        () => {
          return typeof games[gameID].players[player].rounds[round+1][0]() === "number" ?
            games[gameID].players[player].rounds[round+1][0]() : "?";
        }

    } // else do nothing, will be handled as by findNextRoll.
  }

  return GameModel.findNextRoll(gameID, player, round, roll, pins);
}

// returns the same game object, with the subarrays containing rolls populated with 
// corresponding integers instead of functions.
GameModel.plainScores = function (gameID) {
  var games = this.games;

  var game = { nextRoll: games[gameID].nextRoll, players: [] };
  games[gameID].players.forEach(function(player, j){              // for each player
    game.players[j] = { name: player.name, total: 0, rounds: [] };
    for (var i = 0; i < 10; i++) {
      game.players[j].rounds[i] = games[gameID].players[j].rounds[i].map((intFunc) => { 
        game.players[j].total += typeof intFunc() === "number" ? intFunc() : 0;
        return intFunc();
      });
    }
  })
  return game;
}

GameModel.findNextRoll = function (gameID, player, round, roll, pins) {
  var games = this.games;

  var nextRoll = {gameID: gameID, gameOver: false};

  // if special case of final round strike or spare, next roll is a bonus second or third roll.
  if ( round > 8 && ((games[gameID].players[player].rounds[9][0]() === 10) || 
    (games[gameID].players[player].rounds[9][0]() + games[gameID].players[player].rounds[9][1]() >= 10)) && roll < 2 ) {
    nextRoll.player = player;
    nextRoll.round  = round;
    nextRoll.roll   = roll + 1;
  }
  // if not the above and second or third roll of final round of final player, gameover.
  else if (player >= games[gameID].players.length-1 && round > 8 && roll > 0) {
    nextRoll.player = 0;
    nextRoll.round  = 0;
    nextRoll.roll   = 0;
    nextRoll.gameOver = true;
  }

  // if invalid input
  else if (gameID > games.length-1 || player > games[gameID].players.length-1 ||
    round > 9 || roll > 2 || pins > 10 || player < 0 || round < 0 || pins < 0 || roll < 0) {
    return "invalid entry";
    // needs better error handling
  }

  // if end of player's turn OR strike 
  else if (roll === 1 || roll === 2 || (roll === 0 && pins === 10)) {
    // if currently on last player, next is first player's turn; otherwise, next player
    nextRoll.player = player === games[gameID].players.length-1 ? 0 : player+1;

    // if currently on last player, starting new round; otherwise, same round
    nextRoll.round  = player === games[gameID].players.length-1 ? round+1 : round;
    nextRoll.roll   = 0;
  }

  // if first roll of round, and not a strike
  else if (roll === 0) {
    nextRoll.player = player;
    nextRoll.round  = round;
    nextRoll.roll   = 1;
  }
  
  games[gameID].nextRoll = nextRoll;
  return nextRoll;
}

module.exports = GameModel;

//
//
// testing: 
//
//

// games = [];

// GameModel.new(["John", "Sally"])

// var next = GameModel.updateScore(0,0,0,0,Math.round(Math.random()*10));
// // var next = updateScore(0,0,0,0,10);

// while (next !== null) {
//   var player = next.player;
//   next = GameModel.updateScore(next.gameID, next.player, next.round, next.roll, Math.round(Math.random()*10));
//   // console.log(GameModel.plainScores(0).players[player])
//   // console.log("");
// }

// console.log()
// console.log(GameModel.plainScores(0).players[0])
// console.log(GameModel.plainScores(0).players[1])


//
//
// sample data structure created:
// (note that it comes prefilled with functions for at least two rolls per ten rounds that return 
// "-", until overwritten)
//
//

/*
game[0] = { 
  timeoutID: 1234567890,
  nextRoll: {gameID: 1, player: 1, round: 2, roll: 0},
  players: [
    {   // a player
      name: "John",
      rounds: [
        [    // round 1
          () => {return 11}, // an individual roll
          () => {return 1},   // another individual roll (and so on)
          () => {return games[0 <--this game ][0 <--this player ].rounds[1 <--the next round ][0 <--the first roll of that round] (unless undefined, in which case return 0)},
        ],
        [    // round 2
          () => {return 12},
          () => {return games[0][0].rounds[2][0] (unless undefined, in which case return 0)},
          () => {return games[0][0].rounds[2][1] (unless undefined, in which case return 0)}
        ]
      ]
    },
    {  // another player
      name: "Sally",
      rounds: [
        [
          () => {return 11}, 
          () => {return 0}   
        ],
        [
          () => {return 3},
          () => {return 9},
          () => {return games[0][1].rounds[2][0] (unless undefined, in which case return 0)}
        ]
      ]
    }
  ]
}
*/

