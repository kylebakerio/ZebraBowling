var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var GameModel   = require('./model/gameModel.js');
var path        = require('path');
var PORT        = process.env.PORT || 3018;

app.use(bodyParser.json());
app.use(express.static(__dirname + '/client'));
app.use('/node_modules', express.static(path.join(__dirname, '../node_modules')));
app.use(morgan('dev'));

var server = app.listen(PORT, function () {
  var port = server.address().port;
  console.log('Zebra Bowling Service Online @ ' + PORT);
});

//
// Takes an array of names, creates a locally stored game object, and returns 
// user-friendly form of that object which contains the ID needed to access it.
//
app.post('/games', function (req, res) {
  // example expected input: req.body.names === ["John", "Sarah"]
  if ( !Array.isArray(req.body.names) || req.body.names.length < 1 ) {
    console.log("req.body.names is empty or not an array, 400");
    res.status(400).send({message: "Array of names is empty, or was not sent array"});
  }
  else {
    var gameID = GameModel.new(req.body.names);
    res.status(201).send({game: GameModel.plainScores(gameID)});
    // set timer to delete after 6 hours.
    setTimeout(function() {
      GameModel.games[gameID] = undefined;
    }, 21600000); 
  }
});

//
// Returns all game ID's.
//
app.get('/games', function(req,res){
  // could check for credentials, if desired
  var gameIDs = [];
  GameModel.games.forEach((game, index)=>{ gameIDs.push(index) })
  res.status(200).send(gameIDs);
})

// Takes in an ID and returns the game state object, with integers instead
// of functions
app.get('/games/:id', function (req,res) {
  var gameID = Number(req.params.id);
  
  if (typeof GameModel.games[gameID] === "undefined") 
    res.status(404).send({message: "game does not exist"});
  else res.send(GameModel.plainScores(gameID));
})

//
// Idempotent; takes in data on individual rolls that are contained in 
// request body (or constructed by client), returns the round that has been updated. 
// Can create or update, so can be used for 'undo' and 'edit' functions by clients.
//
app.put('/games/:id/rolls', function (req, res) {
  // example: req === {gameID: 13, player: "John", round: 0, roll: 0, pins: 12}
  var player = req.body.player;
  var round  = req.body.round;
  var roll   = req.body.roll;
  var pins   = req.body.pins;
  var gameID = Number(req.params.id);
  
  if (typeof GameModel.games[gameID] === "undefined") 
    res.status(404).send({message: "Game doesn't exist."});
  else {
    GameModel.updateScore(gameID, player, round, roll, pins);
    res.send({round: GameModel.games[gameID].players[player].rounds[round], nextRoll: GameModel.games[gameID].nextRoll});
  }
})

//
// Optional truly restful form of previous endpoint
//
app.put('/games/:id/players/:player/rounds/:round/rolls/:roll', function (req, res) {
  // Example: req.body === {pins: 12}
  var gameID = Number(req.params.id);
  var player = Number(req.params.player);
  var round  = Number(req.params.round);
  var roll   = Number(req.params.roll);
  var pins   = Number(req.body.pins);

  console.log("Updating, via RESTful endpoint, game:", gameID, player, round, roll, pins);

  if (typeof GameModel.games[gameID] === "undefined") res.status(404).send({message: "Game doesn't exist."});
  else {
    GameModel.updateScore(gameID, player, round, roll, pins);
    // More error handling could go here.
    res.send({round: GameModel.games[gameID].players[player].rounds[round], nextRoll: GameModel.games[gameID].nextRoll});
  }
});

app.delete('/games/:id', function (req,res) {
  console.log('trying to delete this game:', GameModel.games[gameID] );
  var gameID = Number(req.params.id);

  if (isNaN(gameID)) res.status(400).send({message: "Not a gameID, please send a valid (numerical) gameID."});
  else if (typeof GameModel.games[gameID] === "undefined") 
    res.status(404).send({
      message: "Cannot be deleted, because it does not exist. Perhaps you already deleted it? Note: Games are deleted after 6 hours. "
    });
  else {
    GameModel.games[gameID] = undefined;
    console.log("Deleted game at index: ", gameID);
    res.status(200).send({message: "Game was successfully deleted. Thanks for playing!"}); 
  }
});
