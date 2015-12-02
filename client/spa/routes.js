var router = function(){  
  m.route.mode = "hash";
  // localStorage.game = JSON.stringify({ 
  //   timeoutID: 1234567890,
  //   nextRoll: {gameID: 1, player: 0, round: 8, roll: 1},
  //   players: [
  //     { name: 'John',
  //       total: 92 - 10,
  //       rounds: [
  //         [ 9, 1, 2 ],
  //         [ 2, 2 ],
  //         [ 5, 5, 1 ],
  //         [ 1, 3 ],
  //         [ 8, 2, 2 ],
  //         [ 2, 2 ],
  //         [ 4, 5 ],
  //         [ 10, 7, "?" ],
  //         [ 7, "-" ],
  //         [ "-", "-" ] 
  //       ] 
  //     },
  //     { name: 'Sally',
  //       total: 92 - 19,
  //       rounds: [
  //         [ 5, 2 ],
  //         [ 1, 9, 4 ],
  //         [ 4, 1 ],
  //         [ 6, 2 ],
  //         [ 0, 4 ],
  //         [ 10, 4, 6 ],
  //         [ 4, 6, 0 ],
  //         [ 0, 5 ],
  //         [ "-", "-" ],
  //         [ "-", "-" ] 
  //       ] 
  //     }
  //   ]
  // })

  m.route(document.getElementById("main"), "/newgame", {

    "/newgame": {
      controller: function () {},
      view: function (ctrl) {
        return m('.app', [
          m.component(Jumbo),
          m.component(CreateGame)
        ])
      }
    }, 

    "/play": {
      controller: function(){},
      view: function(ctrl) {
        return ('.app', [
          m.component(Jumbo),
          m.component(PlayGame, JSON.parse(localStorage.game))
        ])
      }
    }

  });
};