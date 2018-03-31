(function(){
  window.Zebra.Component.CreateGame = {};

  Zebra.Component.CreateGame.view = function(ctrl){  
    return m(".container",
      m(".row", [
        m("h1", "New Game!"),
        m("h5", "Add Players to Get Started"),
        m(".form-group", [
          m("label[for='usr']", "Player Name:"),
          m("input.form-control[id='usr'][type='text']")
        ]),
        m("button.btn.btn-lg.btn-primary", {type: "button", onclick:ctrl.addPlayer}, [
          m("span.glyphicon.glyphicon-user",{"aria-hidden":"true"}), " Add Player"
        ]),
        m("h3", "Players:"),
        ctrl.players.length < 1 ? 
          m("p", "No players yet added") :
          ctrl.players.map(function(name){
            return m("p", name);
          }),
        m("button.btn.btn-lg.btn-success", {type: "button", onclick: ctrl.startGame}, [
          m("span.glyphicon.glyphicon-ok",{"aria-hidden":"true"}), " Start Game"
        ]) 
      ])
    )
  };

  Zebra.Component.CreateGame.controller = function(args){
    var ctrl = this;

    ctrl.players = [];

    ctrl.addPlayer = function() {
      ctrl.players.push(document.getElementById('usr').value);
      $('#usr').val("");
    }

    ctrl.startGame = function() {
      Zebra.Model.newGame(ctrl.players);
    }
  };
})()
