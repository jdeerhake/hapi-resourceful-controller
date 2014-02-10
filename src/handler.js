var _ = require( "lodash" );

function handler( action, controller ) {
  var layout = controller.layout,
    template = controller.name + "/" + action;

  var pub = {
    data : _.clone( controller.data ),
    render : function( obj, conf ) {
      var responder = responderFor( pub.negotiatedType );
      if( responder ) {
        responder.call( pub, _.merge( pub.data, obj ), renderDefaults( conf ) );
      } else {
        pub.reply( pub.request.hapi.error.unsupportedMediaType() );
      }
    },
    error : function( data ) {
      var statusCode = data.statusCode;
      pub.reply().hold().statusCode = statusCode;
      pub.render( data, errorDefaults( statusCode ) );
    },
    responseTypes : function() {
      return controller.responseTypes();
    },
    layout : function(newLayout) {
      layout = newLayout;
    },
    template : function(newTemplate) {
      template = newTemplate;
    }
  };

  [ "title" ].map(function( method ) {
    pub[ method ] = function(val) { pub.data[method] = val; };
  });

  function responderFor( contentType ) {
    return controller.responderFor( contentType );
  }

  function renderDefaults( override ) {
    return _.merge({
      template : template,
      layout : layout
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