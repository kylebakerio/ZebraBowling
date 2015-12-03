(function(){
  window.Zebra.Component.PlayGame = {};

  Zebra.Component.PlayGame.view = function(ctrl){  
    return m("",[
      m(".container", [
        m(".row", 
          m("h2.col-xs-8.col-sm-4.col-md-2", "Next Roll: " + ctrl.game.players[ctrl.game.nextRoll.player].name)
        ),
        m(".row", [
          m("p.col-xs-8.col-sm-4.col-md-2", "Pins Knocked Down: "),
          m(".col-xs-1", [
            m("select.dropdown[id='pins_dropdown'][name='pins']", [
              m("option[value=0]", 0),
              m("option[value=1]", 1),
              m("option[value=2]", 2),
              m("option[value=3]", 3),
              m("option[value=4]", 4),
              m("option[value=5]", 5),
              m("option[value=6]", 6),
              m("option[value=7]", 7),
              m("option[value=8]", 8),
              m("option[value=9]", 9),
              m("option[value=10]", 10)
            ]),
          ]),
        ]),
        m(".clearfix"),
        m(".row", 
          m("button.col-xs-6.col-sm-2.drop-button.btn.btn-lg.btn-success.score-button.submit", {onclick: ctrl.score, type: 'button', "aria-hidden":"true"}, 
            [m("span.glyphicon.glyphicon-ok",{"aria-hidden":"true"}), " SCORE!"]
          )
        ),
        m(".row.space"), 
        m( "", generatePlayerRows(ctrl.game) ),
        m(".row",
          m("button.col-xs-6.col-sm-3.drop-button.btn.btn-lg.btn-warning.score-button", {onclick: ctrl.deleteGame, type: 'button', "aria-hidden":"true"}, 
            [m("span.glyphicon.glyphicon-remove",{"aria-hidden":"true"}), " New Game"]
          ),
           m("button.col-xs-6.col-sm-3.drop-button.btn.btn-lg.btn-danger.score-button", {onclick: ctrl.randomize, type: 'button', "aria-hidden":"true"}, 
            [m("span.glyphicon.glyphicon-random",{"aria-hidden":"true"}), " Randomize"]
          ),
          m("button.col-xs-6.col-sm-3.drop-button.btn.btn-lg.btn-info.score-button", {onclick: function(){location.reload()}, type: 'button', "aria-hidden":"true"}, 
            [m("span.glyphicon.glyphicon-random",{"aria-hidden":"true"}), " Pause Randomization"]
          )
        ),
      ]),
    ])
  } 

  Zebra.Component.PlayGame.controller = function(arg){
    var ctrl  = this;
    ctrl.game = arg;
    ctrl.score = function() {
      var update = ctrl.game.nextRoll;
      if (update.gameOver) {
        alert("Game over! Thanks for playing!");
        return;
      }
      else {
        var e = document.getElementById("pins_dropdown"); 
        var pins = Number(e.options[e.selectedIndex].value); 
        update.pins = pins;
        Zebra.Model.scoreREST(update);
      }
    }

    ctrl.randomize = function(){
      setInterval(function(){
        $('select').val(Math.round(Math.random() * 10));
        $('.submit').click();
      }, 2000);
    }

    ctrl.deleteGame = function(){
      console.log("TRYING TO DELETE GAME");
      if (confirm("Are you sure you want to end this game?")) 
        Zebra.Model.deleteGame();
    }
  };

  function generatePlayerRows(game){
    var playerRows = [];

    for (var player = 0; player < game.players.length; player++) {
      playerRow = [];
      playerRow.push(
        m(".col-xs-12.col-sm-1", [
          m("h4", game.players[player].name),
          m("p", "Total: " + game.players[player].total)
        ])
      )
      
      for (var round = 0; round < game.players[player].rounds.length; round++) {
        var scoreBox = [];
        var subtotal = 0;

        for (var roll = 0; roll < game.players[player].rounds[round].length; roll++) {
          if (round === game.nextRoll.round && player === game.nextRoll.player && roll === game.nextRoll.roll) {
            var rollClass = "b.points.current-roll.col-xs-3";
          }

          else var rollClass = "p.points.col-xs-3";

          if (roll === 0) rollClass += ".col-xs-offset-2"

          scoreBox.push(
            m(rollClass, " " + game.players[player].rounds[round][roll])
          );

          subtotal += typeof game.players[player].rounds[round][roll] === "number" ? 
            game.players[player].rounds[round][roll] : 0;
        }

        scoreBox.push(
          m("b.col-xs-10.col-xs-offset-1.points", " Total: " + subtotal)
        );

        var scoreBoxClass = ".col-xs-4.col-sm-1.scorebox"
        if (round === game.nextRoll.round && player === game.nextRoll.player) scoreBoxClass += ".current-round"; 
        else if (game.players[player].rounds[round][0] === 10) scoreBoxClass += ".strike"; 
        else if (game.players[player].rounds[round][0] + game.players[player].rounds[round][1] === 10) scoreBoxClass += ".spare";

        playerRow.push(
          m(scoreBoxClass, scoreBox)
        )
      }

      playerRows.push(
        m(".row.player", playerRow)
      )
    }

    return playerRows;
  }

})()

// example:
// m(".row.player", [
//   m(".col-xs-1", [
//     m("h4", "John"),
//     m("p", "Total: 106")
//   ]),
//   m(".col-xs-1.scorebox", [
//     m("p.col-xs-3.points.col-xs-offset-2", " 4"),
//     m("p.col-xs-3.points", " 6"),
//     m("p.col-xs-3.points", " 4"),
//     m("p.col-xs-10.col-xs-offset-1.points", [m("b", " Total: 14")])
//   ])
// ])

// game = { 
//   timeoutID: 1234567890,
//   nextRoll: {gameID: 1, player: 1, round: 2, roll: 0},
//   players: [
//     {   // a player
//       name: "John",
//       total: 23,
//       rounds: [
//         [    // round 1
//           9, 1, 10
//         ],
//         [    // round 2
//           10, ?, ?
//         ]
//       ]
//     },
//     {  // another player
//       name: "Sally",
//       total: 20,
//       rounds: [
//         [
//           9, 0 
//         ],
//         [
//           3, 7, ?
//         ]
//       ]
//     }
//   ]
// }
