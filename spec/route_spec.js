/*global expect, describe, it, beforeEach, createSpy*/

var route = require( "../src/route" );

describe( "Route", function() {
  var r, pres, handler, conf,
    request = {},
    reply = {};


  beforeEach(function() {
    pres = [ createSpy( "pre0" ).andReturn( true ) ];
    handler = createSpy( "handler" );
    conf = {
      controller : { name : "things" },
      pre : pres,
      handler : handler
    };
  });

  describe( "handler", function() {
    it( "should call the original handler with request, reply when there are no pres", function() {
      delete conf.pre;
      r = route( "show", conf );
      r.handler( request, reply );
      expect( handler ).toHaveBeenCalledWith( request, reply );
    });
  });


  describe( "pre", function() {
    it( "should wrap pre function around the handler", function() {
      r = route( "show", conf );
      r.handler( request, reply );

      expect( r.pre ).not.toBeDefined();
      expect( pres[0] ).toHaveBeenCalledWith( request, reply );
    });

    it( "should stop handling if a pre returns false", function() {
      var pre1 = createSpy( "pre1").andReturn( false ),
        pre2 = createSpy( "pre2" );
      conf.pre.push( pre1 );
      conf.pre.push( pre2 );
      r = route( "show", conf );
      r.handler( request, reply );

      expect( pres[0] ).toHaveBeenCalled();
      expect( pre1 ).toHaveBeenCalled();
      expect( pre2 ).not.toHaveBeenCalled();
      expect( handler ).not.toHaveBeenCalled();
    });
  });

  describe( "binding", function() {
    it( "should create a unique context for handler and pre", function() {
      r = route( "show", conf );
      r.handler( request, reply );
      r.handler( request, reply );

      expect( handler.calls[1].object ).toBe( pres[0].calls[1].object );
      expect( handler.calls[1].object ).not.toBe( pres[0].calls[0].object );
    });
  });

  describe( "attributes", function() {
    it( "should set the route name", function() {
      r = route( "show", conf );

      expect( r.app.name ).toBe( "things_show" );
    });

    it( "should allow overriding of route attributes", function() {
      conf.route = { app : "foo" };
      r = route( "show", conf );

      expect( r.app ).toBe( "foo" );
    });
  });

});