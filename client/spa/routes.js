window.Zebra = {Component: {}, Model: {}};

Zebra.router = function(){  
  m.route.mode = "hash";

  m.route(document.getElementById("main"), "/newgame", {

    "/newgame": {
      controller: function () {},
      view: function (ctrl) {
        return m('.app', [
          m.component(Zebra.Component.Jumbo),
          m.component(Zebra.Component.CreateGame)
        ])
      }
    }, 

    "/play": {
      controller: function(){},
      view: function(ctrl) {
        return ('.app', [
          m.component(Zebra.Component.Jumbo),
          m.component(Zebra.Component.PlayGame, JSON.parse(localStorage.game))
        ])
      }
    }

  });
};