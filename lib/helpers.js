var _ = require( "lodash" ),
  Negotiator = require( "negotiator" ),
  log = require( "./logger" );

var RESOURCE_ACTIONS = [ "index", "new", "create", "show", "edit", "update", "destroy" ];

module.exports = {
  wrapHandlerMethods : function( handlers, wrapper, context ) {
    return Object.keys( handlers ).reduce( function( wrappedHandlers, action ) {
      wrappedHandlers[ action ] = _.wrap( handlers[action], wrapper.bind( context, action ) );
      return wrappedHandlers;
    }, {});
  },
  resourceConvenienceMethods : (function() {
    return RESOURCE_ACTIONS.reduce(function( methods, action ) {
      methods[action] = function( cb ) { this.addHandler( action, cb ); };
      return methods;
    }, {});
  }()),
  beforeHandler : function( action, handler, req, res ) {
    var context = this;
    req.app.action = action;
    if( this._beforeFuncs.every(function(f) {
      return f.call(context, req, res);
    }) ) {
      return handler.call( context, req, res );
    } else {
      return false;
    }
  },
  logRequest : function( req ) {
    log.info({ req : req });
    return true;
  },
  captureRequest : function( req, reply ) {
    this.request = req;
    this.reply = reply;
    return true;
  },
  negotiateContentType : function( req ) {
    var negotiator = new Negotiator( req.raw.req );
    req.app.contentType = negotiator.mediaType( Object.keys( this._responders ) );
    return true;
  },
  renderDefaults : function() {
    return {
      template : this.template(),
      layout : this._layout
    };
  }
};