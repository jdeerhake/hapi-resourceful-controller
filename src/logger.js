var bunyan = require( "bunyan" );

module.exports = bunyan.createLogger({
  name : "hapi-controller",
  serializers : {
    req : function(req) {
      return {
        headers : req._headers,
        host : req.host,
        path : req.path,
        req_id : req.req_id
      };
    },
    res : function(res) {
      return {
        status : res.statusCode,
        req_id : res.req_id
      };
    }
  },
  streams : [
    {
      level : "info",
      stream : process.stdout
    }
  ]
});