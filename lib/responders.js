module.exports = {
  "text/html" : function( obj, conf ) {
    var template = conf.template;
    delete conf.template;
    this.reply.view( template, obj, conf );
  },
  "application/json" : function( obj ) {
    this.reply( obj );
  }
};