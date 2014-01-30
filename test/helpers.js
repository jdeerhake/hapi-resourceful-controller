/*global expect, describe, it, beforeEach, spyOn*/

var helpers = require( "../lib/helpers.js" );

describe( "Helpers", function() {
  var controller;

  beforeEach(function() {
    controller = new Controller( "things" );
  });

  describe( "#wrapHandlerMethods", function() {
    var spied = {},
      interface;

    beforeEach(function() {
      spied.wrapper = function() { return true; };
      spied.wrapped = function() {};
      spyOn( spied, "wrapper" );
      spyOn( spied, "wrapped" );
      controller.show( spied.wrapped );
      interface = helpers.wrapHandlerMethods( controller._handlers, spied.wrapper, controller );
    });

    it( "should wrap defined handlers with a given function", function() {
      interface.show();
      expect( spied.wrapper ).toHaveBeenCalled();
      expect( spied.wrapped ).toHaveBeenCalled();
    });

  });
});