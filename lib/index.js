var helpers = require( "./helpers" ),
  extend = require( "extend" ),
  httpStatus = require( "http-status" );

var defaultResponders = require( "./responders");

function Controller( name ) {
  this.name = name;
  this._handlers = {};
  this._beforeFuncs = [ helpers.logRequest, helpers.captureRequest, helpers.negotiateContentType ];
  this._responders = extend( {}, defaultResponders );
}

extend( Controller.prototype, helpers.resourceConvenienceMethods, {
  before : function( func ) {
    this._beforeFuncs.push( func );
  },
  template : function() {
    return this.name + "/" + this.request.app.action;
  },
  addHandler : function( action, cb ) {
    this._handlers[ action ] = cb;
  },
  interface : function() {
    return helpers.wrapHandlerMethods( this._handlers, helpers.beforeHandler, this );
  },
  render : function( obj, conf ) {
    var render = this._renderer[ this.request.app.contentType ];

    conf = extend( helpers.renderDefaults.call( this ), conf );

    if( render ) {
      render.call( this, obj, conf );
    } else {
      this.reply().code( httpStatus.UNSUPPORTED_MEDIA_TYPE );
    }
  },
  setLayout : function( path ) {
    this._layout = path;
  }
});


Controller.addResponder = function( contentType, cb ) {
  defaultResponders[ contentType ] = cb;
};



module.exports = Controller;