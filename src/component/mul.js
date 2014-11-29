"use strict";

var util = require("../util");
var NeuComponent = require("./component");

function NeuMul(context, a, b) {
  if (a instanceof util.NeuDC) {
    a = a.valueOf();
  }
  if (b instanceof util.NeuDC) {
    b = b.valueOf();
  }
  if (typeof a === "number" && typeof b === "number") {
    return context.createNeuDC(a * b);
  }
  NeuComponent.call(this, context);

  if (typeof a === "number") {
    var t = a; a = b; b = t;
  }
  if (b === 0) {
    return context.createNeuDC(0);
  } else if (b === 1) {
    return context.createNeuComponent(a);
  }
  this._a = a;
  this._b = b;
}
util.inherits(NeuMul, NeuComponent);

NeuMul.$name = "NeuMul";

NeuMul.prototype.toAudioNode = function() {
  if (this.$outlet === null) {
    this.$outlet = this.$context.createGain();
    this.$outlet.gain.value = 0;
    this.$context.connect(this._a, this.$outlet);
    this.$context.connect(this._b, this.$outlet.gain);
  }
  return this.$outlet;
};

NeuMul.prototype.connect = function(to) {
  this.$context.connect(this.toAudioNode(), to);
  return this;
};

NeuMul.prototype.disconnect = function() {
  this.$context.disconnect(this.$outlet);
  return this;
};

module.exports = util.NeuMul = NeuMul;
