var _ = require( "lodash" );

function handler( action, controller ) {

  var me = {
    render : function( obj, conf ) {
      var responder = controller.responders[ me.wants ];
      if( responder ) {
        responder.call( me, obj, renderDefaults( conf ) );
      } else {
        me.reply( me.request.hapi.error.unsupportedMediaType() );
      }
    },
    responseTypes : function() {
      return Object.keys( controller.responders );
    }
  };

  function renderDefaults( override ) {
    return _.merge({
      template : controller.name + "/" + action,
      layout : controller.layout
    }, override);
  }

  return me;
}



module.exports = handler;