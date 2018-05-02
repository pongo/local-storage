'use strict';

var listeners = Object.create(null);
var listening = false;

function listen () {
  listening = true;
  global.addEventListener('storage', change, false);
}

function change (e) {
  if (!e) {
    e = global.event;
  }
  var all = listeners[e.key];
  if (all) {
    all.forEach(fire);
  }

  function fire (listener) {
    listener(JSON.parse(e.newValue), JSON.parse(e.oldValue), e.url || e.uri);
  }
}

function on (key, fn) {
  if (listeners[key]) {
    listeners[key].push(fn);
  } else {
    listeners[key] = [fn];
  }
  if (listening === false) {
    listen();
  }
}

function off (key, fn) {
  var ns = listeners[key];
  if (ns.length > 1) {
    ns.splice(ns.indexOf(fn), 1);
  } else {
    listeners[key] = [];
  }
}

function clear() {
  global.removeEventListener('storage', change);
  listeners = Object.create(null);
  listening = false;
}

module.exports = {
  on: on,
  off: off,
  clear: clear
};
