(function(){
  window.Model = {};

  Model.newGame = function (players) {
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
    })    
  };

  Model.score = function (nextRoll) {
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
  };

}())

