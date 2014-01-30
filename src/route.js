var _ = require( "lodash" ),
  handler = require( "./handler" );

var route = function( action, config ) {
  var controller = config.controller,
    handlerFunc = config.handler,
    handlerMaker = handler.bind( null, action, controller ),
    pres = config.pre || [];

  function collapsedPre() {
    var bind = this,
      args = arguments;

    return pres.every( function( pre ) {
      return pre.apply( bind, args );
    } );
  }

  function handlerWithPre() {
    var context = handlerMaker();

    if( collapsedPre.apply( context, arguments ) ) {
      handlerFunc.apply( context, arguments );
    }
  }

  function interface() {
    return _.merge({
      app : {
        name : controller.name + "_" + action
      }
    }, config.route, {
      handler : handlerWithPre
    });
  }


  return interface();

};

module.exports = route;