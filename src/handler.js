var _ = require( "lodash" ),
  log = require( "./logger" );

function handler( action, controller ) {

  var pub = {
    render : function( obj, conf ) {
      var responder = pub.responderFor( pub.negotiatedType );
      if( responder ) {
        responder.call( pub, obj, renderDefaults( conf ) );
      } else {
        pub.reply( pub.request.hapi.error.unsupportedMediaType() );
      }
    },
    error : function( statusCode, data ) {
      pub.reply().hold().statusCode = statusCode;
      pub.render( data, errorDefaults( statusCode ) );
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

  function errorDefaults( statusCode, override ) {
    return _.merge({
      template : "errors/" + statusCode,
      layout : false
    }, override );
  }

  return pub;
}



module.exports = handler;