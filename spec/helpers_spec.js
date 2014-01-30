/*global expect, describe, it, beforeEach, createSpy*/

var helpers = require( "../src/helpers" );

describe( "Helpers", function() {

  describe( "#tagRequest", function() {
    it( "should add a UUID to context and request obj", function() {
      var req = { app : {} },
        context = {};
      helpers.tagRequest.call( context, req );

      expect( context.uuid ).toBeDefined();
      expect( req.app.uuid ).toBeDefined();
      expect( req.app.uuid ).toEqual( context.uuid );
    });
  });

  describe( "captureRequest", function() {
    var context = {},
      req = { test : Math.random() },
      reply = { test : Math.random() };

    helpers.captureRequest.call( context, req, reply );

    it( "should set request and reply properties of the context", function() {
      expect( context.request ).toBe( req );
      expect( context.reply ).toBe( reply );
    });
  });

  describe( "resourceConvenienceMethods", function() {
    var response, addHandler;

    beforeEach(function() {
      addHandler = createSpy( "addHandler" );
      response = helpers.resourceConvenienceMethods( addHandler );
    });

    it( "should return an object with resourceful keys", function() {
      expect( response.show ).toBeDefined();
      expect( response.index ).toBeDefined();
    });

    it( "should proxy each convenience function to the given method", function() {
      var dummyFunc = function() {};
      response.show( dummyFunc );
      expect( addHandler ).toHaveBeenCalledWith( "show", dummyFunc );
    });
  });

});