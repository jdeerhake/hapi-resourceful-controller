/*global expect, describe, it, beforeEach, createSpy*/

var handler = require( "../src/handler" ),
  controller = require( "../src/controller" );

describe( "Handler", function() {
  var h, c;

  beforeEach(function() {
    c = controller( "things" );
    c.layout = "thingsLayout";
    h = handler( "show", c );
  });

  describe( "responseTypes", function() {
    it( "should delegate to the controller for available response types", function() {
      expect( h.responseTypes() ).toEqual( c.responseTypes() );
    });
  });

  describe( "render", function() {
    var usedResponder, unusedResponder, data = {};

    beforeEach(function() {
      usedResponder = createSpy( "responder" );
      unusedResponder = createSpy( "unused responder" );
      c.addResponder( "text/html", usedResponder );
      c.addResponder( "text/plain", unusedResponder );
      h.negotiatedType = "text/html";
    });

    it( "calls the correct responder based on negotiated contentType", function() {
      h.render( data );
      expect( usedResponder ).toHaveBeenCalled();
      expect( unusedResponder ).not.toHaveBeenCalled();
    });

    it( "provides a data object and default config to the responder", function() {
      var conf = { template : "things/show",
                  layout : "thingsLayout" };

      h.render( data );

      expect( usedResponder ).toHaveBeenCalledWith( data, conf );
    });

    it( "allows you to overide the render config passed to the responder", function() {
      var conf = { layout : false, template : "other_things/show" };
      h.render( data, conf );
      expect( usedResponder ).toHaveBeenCalledWith( data, conf );
    });

  });
});