"use strict";

var util = require("../../src/util");

describe("util", function() {

  describe(".isPlainObject(value)", function() {
    it("checks if value is an object created by the Object constructor", function() {
      assert(util.isPlainObject({}) === true);
      assert(util.isPlainObject(new RegExp()) === false);
    });
  });

  describe(".isFinite(value)", function() {
    it("checks if value is a finite number", function() {
      assert(util.isFinite(10) === true);
      assert(util.isFinite(Infinity) === false);
      assert(util.isFinite(NaN) === false);
      assert(util.isFinite("10") === false);
    });
  });

  describe(".isIterator(value)", function() {
    it("checks is value is an iterator", function() {
      assert(util.isIterator({ next: it }) === true);
      assert(util.isIterator({ prev: it }) === false);
      assert(util.isIterator() === false);
    });
  });

  describe(".toArray(list)", function() {
    it("converts the list to an array", function() {
      assert.deepEqual(util.toArray(arguments), []);
      assert.deepEqual(util.toArray([ 5, 10 ]), [ 5, 10 ]);
      assert.deepEqual(util.toArray(null), []);
    });
  });

  describe(".flatten", function() {
    it("flattens a nested array", function() {
      assert.deepEqual(util.flatten([ 1, [ 2 ], [ 3, [ [ 4 ] ] ] ]), [ 1, 2, 3, 4 ]);
    });
  });

  describe(".definePropertyIfNotExists(obj, prop, descriptor)", function() {
    it("defines a property if not exists", function() {
      var obj = {};

      util.definePropertyIfNotExists(obj, "value", { value: 100 });
      util.definePropertyIfNotExists(obj, "value", { value: 200 });

      assert(obj.value === 100);
    });
  });

  describe(".format(fmt, dict)", function() {
    it("should format with an array", function() {
      assert(util.format("#{0} is #{1}", [
        "rock and roll", "dead", "!?"
      ]) === "rock and roll is dead");
    });
    it("should format with a dictionary", function() {
      assert(util.format("#{a} is #{b}", {
        a: "rock and roll", b: "dead", ".": "!?"
      }) === "rock and roll is dead");
    });
  });

  describe(".num(value)", function() {
    it("converts into a number", function() {
      assert(util.num(10) === 10);
      assert(util.num("10") === 10);
      assert(util.num(Infinity) === Infinity);
      assert(util.num(NaN) === 0);
      assert(util.num("zero") === 0);
    });
  });

  describe(".int(value)", function() {
    it("converts into an integer", function() {
      assert(util.int(10.5) === 10);
      assert(util.int("10.5") === 10);
      assert(util.int(Infinity) === 0);
      assert(util.int(NaN) === 0);
      assert(util.int("zero") === 0);
    });
  });

  describe(".finite(value)", function() {
    it("converts into a finite number", function() {
      assert(util.finite(10) === 10);
      assert(util.finite(10.5) === 10.5);
      assert(util.finite("10") === 10);
      assert(util.finite("10.5") === 10.5);
      assert(util.finite(Infinity) === 0);
      assert(util.finite(NaN) === 0);
      assert(util.finite("zero") === 0);
    });
  });

  describe(".clip(value, min, max)", function() {
    it("clip a value", function() {
      assert(util.clip(-1.5, -1, +1) === -1);
      assert(util.clip(-0.5, -1, +1) === -0.5);
      assert(util.clip(+0.5, -1, +1) === +0.5);
      assert(util.clip(+1.5, -1, +1) === +1);
    });
  });

  describe(".typeOf(value)", function() {
    it("returns type name", function() {
      assert(util.typeOf(10) === "number");
      assert(util.typeOf([]) === "array");
      assert(util.typeOf("") === "string");
      assert(util.typeOf(it) === "function");
      assert(util.typeOf({}) === "object");
      assert(util.typeOf(true) === "boolean");
      assert(util.typeOf(null) === "null");
      assert(util.typeOf(undefined) === "undefined");
      assert(util.typeOf(NaN) === "nan");
      assert(util.typeOf(new Float32Array()) === "Float32Array");
      assert(util.typeOf({ constructor: null }) === "object");
      assert(util.typeOf({ constructor: true }) === "object");

      function A() {} // minified
      A.$$name = "NeuBuffer";

      var a = new A();

      assert(util.typeOf(a) === "NeuBuffer");
    });
  });

  describe(".defaults(..args: any)", function() {
    it("return default value if it receives null or undefined", function() {
      assert(util.defaults(1, 10) === 1);
      assert(util.defaults(0, 10) === 0);
      assert(util.defaults(null, 10) === 10);
      assert(util.defaults(undefined, 10) === 10);
      assert(util.defaults(null, 1, 10) === 1);
      assert(util.defaults(undefined, 0, 10) === 0);
      assert(util.defaults(null, null, 10) === 10);
      assert(util.defaults(undefined, undefined, 10) === 10);
      assert(util.defaults(undefined, undefined, undefined) === null);
    });
  });

  describe(".inherits(ctor, superCtor)", function() {
    it("inherit the prototype methods from one constructor into another. ", function() {
      function A() {}
      function B() {}
      util.inherits(B, A);
      assert(new B() instanceof A);
    });
  });

});
