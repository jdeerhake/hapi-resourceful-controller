/*global describe, it*/

var expect = require( "expect.js" ),
  Controller = require( "./index.js" );

describe( "A controller", function() {
  var thingsController = new Controller( "thing" );

  it( "should do things", function() {
    expect( "a thing" ).to.eql( "a thing" );
  });

});