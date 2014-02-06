var helpers = require( "./helpers" ),
  _ = require( "lodash" ),
  route = require( "./route" ),
  defaultResponders = require( "./responders" );


function controller( name ) {
  var handlers = {},
    befores = [],
    responders = _.clone( defaultResponders ),
    layout = null;

  var pub = {
    name : name,
    layout : layout,
    addHandler : function( action, callback, config ) {
      handlers[ action ] = { handler : callback, config : config };
    },
    before : function( actions, func ) {
      if( func ) {
        addBefore( [].concat( actions ), func );
      } else if( typeof actions === "function" ) {
        addBefore( [ "all" ], actions );
      } else {
        return getBeforeFor( actions );
      }
    },
    interface : function() {
      return _.mapValues( handlers, function( conf, action ) {
        conf.pre = getBeforeFor( action );
        conf.controller = pub;
        return route( action, conf );
      } );
    },
    responseTypes : function() {
      return Object.keys( responders );
    },
    addResponder : function( contentType, cb ) {
      responders[ contentType ] = cb;
    },
    responderFor : function( contentType ) {
      return responders[ contentType ];
    }
  };

  _.extend( pub, helpers.resourceConvenienceMethods( pub.addHandler ) );

  function getBeforeFor( action ) {
    return befores.reduce(function( out, before ) {
      if( before.actions.indexOf( action ) !== -1 ||
          before.actions.indexOf( "all" ) !== -1 ) {
        out.push( before.func );
      }
      return out;
    }, []);
  }

  function addBefore( actions, func ) {
    befores.push({
      actions : actions,
      func : func
    });
  }

  pub.before( helpers.captureRequest );
  pub.before( helpers.negotiateContentType );

  return pub;
}

controller.addResponder = function( contentType, cb ) {
  defaultResponders[ contentType ] = cb;
};



module.exports = controller;