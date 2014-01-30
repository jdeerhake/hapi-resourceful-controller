var _ = require( "lodash" ),
  context = require( "./context" );

var handler = function( action, callback, config ) {
  var controller = config.controller;
  delete config.controller;

  var pub =  {
    toRoute : function() {
      return _.merge({
        handler : callback,
        bind : context.bind( null, action, controller ),
        app : {
          name : controller.name + "_" + action
        }
      }, config );
    }
  };

  return pub;

};

module.exports = handler;