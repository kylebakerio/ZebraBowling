(function(){
  window.Zebra.Model = {};

  Zebra.Model.newGame = function (players) {
    console.log("Creating game with " + players);
    m.request({
      method: 'POST',
      url: '/games',
      data: {names: players}
    })
    .then(function(res){
      console.log(res);
      localStorage.game = JSON.stringify(res.game);
      m.route("/play");
    });
  };

  Zebra.Model.score = function (nextRoll) {
    console.log("Rolling: ", nextRoll);
    m.request({
      method: 'PUT',
      url: '/games/'+nextRoll.gameID+"/rolls",
      data: nextRoll
    })
    .then(function(res1){
      console.log("updated round: ", res1);
      return m.request({
        method: 'GET',
        url: '/games/'+nextRoll.gameID
      });
    })
    .then(function(res2){
      if (res2.nextRoll.gameOver) alert("Game over! Thanks for playing!");
      console.log("full game:", res2);
      console.log("next roll: ", res2.nextRoll);
      localStorage.game = JSON.stringify(res2);
      m.route("/play");
    })
  }

  Zebra.Model.scoreREST = function (nextRoll) {
    console.log("Rolling: ", nextRoll);
    var reqURL =
      '/games/'   + nextRoll.gameID +
      '/players/' + nextRoll.player +
      '/rounds/'  + nextRoll.round +
      '/rolls/'   + nextRoll.roll
    console.log("reqURL:", reqURL)

    m.request({
      method: 'PUT',
      url: reqURL,
      data: {pins: nextRoll.pins}
    })
    .then(function(res1){
      console.log("updated round: ", res1);
      return m.request({
        method: 'GET',
        url: '/games/'+nextRoll.gameID
      });
    })
    .then(function(res2){
      if (res2.nextRoll.gameOver) alert("Game over! Thanks for playing!");
      console.log("full game:", res2);
      console.log("next roll: ", res2.nextRoll);
      localStorage.game = JSON.stringify(res2);
      m.route("/play");
    });
  };

  Zebra.Model.deleteGame = function () {
    gameID = JSON.parse(localStorage.game).nextRoll.gameID;

    m.request({
      method: 'DELETE',
      url: '/games/' + gameID
    })
    .then(function(res1){
      console.log(res1);
      m.route("/newgame");
    });
  }

}())

