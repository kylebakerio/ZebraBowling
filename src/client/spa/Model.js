(function(){
  window.Zebra.Model = {};

  Zebra.Model.Game = m.prop();
  Zebra.Model.fullAutoRando = m.prop(false);

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
      Zebra.Model.Game(res.game)
      m.route("/play");
    });
  };

  Zebra.Model.scoreREST = function (nextRoll) {
    console.log("Rolling: ", nextRoll);
    var reqURL =
      '/games/'   + nextRoll.gameID +
      '/players/' + nextRoll.player +
      '/rounds/'  + nextRoll.round +
      '/rolls/'   + nextRoll.roll;

    var reqObj = {
      method: 'PUT',
      url: reqURL,
      data: {pins: nextRoll.pins}
    };
    console.log("reqObj:", reqObj);

    m.request(reqObj)
    .then(function(res1){
      console.log("updated round: ", res1);
      return m.request({
        method: 'GET',
        url: '/games/'+nextRoll.gameID
      });
    })
    .then(function(res2){
      console.log("full game:", res2);
      console.log("next roll: ", res2.nextRoll);
      localStorage.game = JSON.stringify(res2);
      Zebra.Model.Game(res2);
      if (res2.nextRoll.gameOver) alert("Game over! Thanks for playing!");
      else if (Zebra.Model.fullAutoRando()) {
        var update = res2.nextRoll;
        update.pins = Math.round(Math.random() * 10);
        setTimeout(() => Zebra.Model.scoreREST(update), 500);
      }
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
  };

}());
