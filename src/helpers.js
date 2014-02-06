var Negotiator = require( "negotiator" ),
  RESOURCE_ACTIONS = [ "index", "new", "create", "show", "edit", "update", "destroy" ];

var helpers = {
  negotiateContentType : function( req ) {
    var negotiator = new Negotiator( req.raw.req );
    this.wantsTypes = negotiator.mediaTypes();
    this.negotiatedType = req.app.contentType = negotiator.mediaType( this.responseTypes() );
    return true;
  },
  captureRequest : function( req, reply ) {
    this.request = req;
    this.reply = reply;
    return true;
  },
  resourceConvenienceMethods : function( addMethod ) {
    return RESOURCE_ACTIONS.reduce(function( methods, action ) {
      methods[ action ] = addMethod.bind( null, action );
      return methods;
    }, {});
  }
};


module.exports = helpers;