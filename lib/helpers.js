var Negotiator = require( "negotiator" ),
  uuid = require( "uuid" ),
  RESOURCE_ACTIONS = require( "./resourceful_actions" );

var helpers = {
  tagRequest : function( req ) {
    this.id = req.app.id = uuid.v1();
    return true;
  },
  negotiateContentType : function( req ) {
    var negotiator = new Negotiator( req.raw.req );
    this.wants = req.app.contentType = negotiator.mediaType( this.responseTypes() );
    return true;
  },
  captureRequest : function( req, reply ) {
    this.request = req;
    this.reply = reply;
    return true;
  },
  resourceConvenienceMethods : (function() {
    return RESOURCE_ACTIONS.reduce(function( methods, action ) {
      methods[action] = function( cb ) { this.addHandler( action, cb ); };
      return methods;
    }, {});
  }()),
  collapsePre : function( pres ) {
    return function( request, reply ) {
      return pres.every( (function( pre ) {
        return pre.call( this, request, reply );
      }).bind( this ) );
    };
  },
  lateBind : function( route ) {
    if( typeof route.bind === "function" ) {
      var handler = route.handler,
        makeContext = route.bind,
        pre = helpers.collapsePre( [].concat( route.pre ) );

      route.handler = function(request, reply) {
        var context = makeContext( request, reply );
        if( pre.call( context, request, reply ) ) {
          handler.call( context, request, reply );
        }
      };
      delete route.bind;
      delete route.pre;
    }
    return route;
  }
};


module.exports = helpers;