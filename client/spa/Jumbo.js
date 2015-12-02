(function(){
  window.Jumbo = {};

  Jumbo.view = function(ctrl){  
    return m(".jumbotron.row", [
      m(".col-sm-6", [
        m("img[height='250px'][src='http://www.zebrapen.com/wp-content/themes/zebra/images/zen/ZenFooter.png']")
      ]),
      m("h1.col-sm-6", "Zebra Bowling!")
    ])
  };

  Jumbo.controller = function(args){

  };
})()
