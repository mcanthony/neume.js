"use strict";

var utils = {};

utils.isArray = function(value) {
  return Array.isArray(value);
};

utils.isBoolean = function(value) {
  return typeof value === "boolean";
};

utils.isDictionary = function(value) {
  return value != null && value.constructor === Object;
};

utils.isFunction = function(value) {
  return typeof value === "function";
};

module.exports = utils;
