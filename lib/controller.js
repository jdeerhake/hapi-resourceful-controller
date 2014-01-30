var helpers = require( "./helpers" ),
  _ = require( "lodash" ),
  handler = require( "./handler" ),
  defaultResponders = require( "./responders" );


function controller( name ) {
  var handlers = {},
    befores = [],
    responders = _.clone( defaultResponders ),
    layout = null;

  var pub = _.extend({
    name : name,
    responders : responders,
    layout : layout,
    addHandler : function( action, callback, config ) {
      config = config || {};
      config.controller = pub;
      handlers[ action ] = handler( action, callback, config );
    },
    before : function( actions, func ) {
      if( func ) {
        actions = [].concat( actions );
      } else {
        func = actions;
        actions = [ "all" ];
      }

      befores.push({
        actions : actions,
        func : func
      });
    },
    interface : function() {
      return _.mapValues( handlers, function( handler, action ) {
        var routeDef = handler.toRoute();
        routeDef.pre = beforeFor( action );
        return helpers.lateBind( routeDef );
      } );
    }
  }, helpers.resourceConvenienceMethods );

  function beforeFor( action ) {
    return befores.reduce(function( out, before ) {
      if( before.actions.indexOf( action ) !== -1 ||
          before.actions.indexOf( "all" ) !== -1 ) {
        out.push( before.func );
      }
      return out;
    }, []);
  }

  pub.before( helpers.captureRequest );
  pub.before( helpers.tagRequest );
  pub.before( helpers.negotiateContentType );

  return pub;
}

controller.addResponder = function( contentType, cb ) {
  defaultResponders[ contentType ] = cb;
};



module.exports = controller;