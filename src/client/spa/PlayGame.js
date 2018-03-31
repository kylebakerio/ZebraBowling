(function(){
  window.Zebra.Component.PlayGame = {};

  Zebra.Component.PlayGame.view = function(ctrl){  
    console.log(ctrl.game())
    return m("",[
      m(".container", [
        m(".row", 
          m("h2.col-xs-8.col-sm-4.col-md-2", "Next Roll: " + Zebra.Model.Game().players[Zebra.Model.Game().nextRoll.player].name)
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
          m("button.col-xs-6.col-sm-2.drop-button.btn.btn-lg.btn-success.score-button.submit", 
            {onclick: ctrl.score, type: 'button', "aria-hidden":"true"}, 
            [m("span.glyphicon.glyphicon-ok",{"aria-hidden":"true"}), " SCORE!"]
          )
        ),
        m(".row.space"), 
        m( "", generatePlayerRows(Zebra.Model.Game()) ),
        m(".row",
          m("button.col-xs-6.col-sm-3.drop-button.btn.btn-lg.btn-warning.score-button", 
            {onclick: ctrl.deleteGame, type: 'button', "aria-hidden":"true"}, 
            [m("span.glyphicon.glyphicon-remove",{"aria-hidden":"true"}), " New Game"]
          ),
           m("button.col-xs-6.col-sm-3.drop-button.btn.btn-lg.btn-danger.score-button", 
            {onclick: ctrl.randomize, type: 'button', "aria-hidden":"true"}, 
            [m("span.glyphicon.glyphicon-random",{"aria-hidden":"true"}), " Randomize"]
          ),
          m("button.col-xs-6.col-sm-3.drop-button.btn.btn-lg.btn-info.score-button", 
            {onclick: () => Zebra.Model.fullAutoRando(false), type: 'button', "aria-hidden":"true"}, 
            [m("span.glyphicon.glyphicon-random",{"aria-hidden":"true"}), " Pause Randomization"]
          )
        ),
      ]),
    ])
  } 

  Zebra.Component.PlayGame.controller = function(){
    var ctrl  = this;
    ctrl.game = Zebra.Model.Game;

    ctrl.score = function() {
      var update = ctrl.game().nextRoll;
      var elem = document.getElementById("pins_dropdown"); 
      update.pins = Number(elem.options[elem.selectedIndex].value); 
      Zebra.Model.scoreREST(update);
    };

    ctrl.randomize = function(){
      Zebra.Model.fullAutoRando(true);
      ctrl.score();
    };

    ctrl.deleteGame = function(){
      if (confirm("Are you sure you want to end this game?")) {
        Zebra.Model.deleteGame();
      }
    }
  };

  function generatePlayerRows(game=Zebra.Model.Game()){
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
          if (!game.nextRoll.gameOver && round === game.nextRoll.round && player === game.nextRoll.player && roll === game.nextRoll.roll) {
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
        if (!game.nextRoll.gameOver && round === game.nextRoll.round && player === game.nextRoll.player) 
          scoreBoxClass += ".current-round"; 
        else if (game.players[player].rounds[round][0] === 10) 
          scoreBoxClass += ".strike"; 
        else if (game.players[player].rounds[round][0] + game.players[player].rounds[round][1] === 10) 
          scoreBoxClass += ".spare";

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
