var _ = require( "lodash" );

function handler( action, controller ) {

  var pub = {
    render : function( obj, conf ) {
      var responder = pub.responderFor( this.negotiatedType );
      if( responder ) {
        responder.call( pub, obj, renderDefaults( conf ) );
      } else {
        pub.reply( pub.request.hapi.error.unsupportedMediaType() );
      }
    },
    responseTypes : function() {
      return controller.responseTypes();
    },
    responderFor : function( contentType ) {
      return controller.responderFor( contentType );
    }
  };

  function renderDefaults( override ) {
    return _.merge({
      template : controller.name + "/" + action,
      layout : controller.layout
    }, override );
  }

  return pub;
}



module.exports = handler;