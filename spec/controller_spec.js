/*global expect, describe, it, beforeEach*/

describe( "Controller", function() {
  var controller,
    responder = function() {};

  beforeEach(function() {
    Object.keys( require.cache ).forEach(function( filename ) {
      if( filename.match( /src\/controller\.js$/ ) ) {
        delete require.cache[ filename ];
      }
    });
    controller = require( "../src/controller" );
  });


  describe( "addResponder", function() {

    it( "should add a responder available to all controllers", function() {
      controller.addResponder( "a/thing", responder );
      var c = controller( "things" );
      expect( c.responseTypes() ).toContain( "a/thing" );
    });

  });

});

describe( "Controller instance", function() {
  var controller = require( "../src/controller" ),
    c;

  beforeEach(function() {
    c = controller( "things" );
  });

  describe( "before", function() {
    var beforeFunc = function() {};

    it( "should return an array of before functions when only an action is specified", function() {
      var befores = c.before( "show" );
      expect( Array.isArray( befores ) ).toBe( true );
    });

    it( "should add a before function to the given array of actions", function() {
      c.before( [ "show", "index" ], beforeFunc );
      expect( c.before( "show" ) ).toContain( beforeFunc );
      expect( c.before( "create" ) ).not.toContain( beforeFunc );
    });

    it( "should allow a single string as an action", function() {
      c.before( "show", beforeFunc );
      expect( c.before( "show") ).toContain( beforeFunc );
    });

    it( "should apply to all actions when none are specified", function() {
      c.before( beforeFunc );
      expect( c.before( "show") ).toContain( beforeFunc );
      expect( c.before( "foo") ).toContain( beforeFunc );
    });

  });


  describe( "interface", function() {
    var handler = function() {};

    it( "should return an interface object with actions as keys", function() {
      c.index( handler );
      var interface = c.interface();
      expect( interface.index ).toBeDefined();
      expect( interface.show ).not.toBeDefined();
    });

  });

  describe( "responseTypes", function() {

    it( "should return an array of available contentType responders", function() {
      var responseTypes = c.responseTypes();

      expect( responseTypes ).toContain( "text/html" );
      expect( responseTypes ).toContain( "application/json" );
      expect( responseTypes ).not.toContain( "not_a/real_response_type" );
    });
  });

  describe( "addResponder", function() {
    var responder = function() {};

    it( "should add a responder to available responseTypes", function() {
      c.addResponder( "application/javascript", responder );
      expect( c.responseTypes() ).toContain( "application/javascript" );
    });
  });

  describe( "instantiation", function() {

    it( "should add helpers as before functions for all actions", function() {
      var befores = c.before( "foo" ),
        helpers = require( "../src/helpers" );

      expect( befores ).toContain( helpers.captureRequest );
      expect( befores ).toContain( helpers.tagRequest );
      expect( befores ).toContain( helpers.negotiateContentType );
    });

    it( "should initialize name and layout attributes", function() {
      expect( c.name ).toBe( "things" );
      expect( c.layout ).toBe( null );
    });

  });
});