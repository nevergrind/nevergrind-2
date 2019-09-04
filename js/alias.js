// aliases
var getById = document.getElementById.bind(document);
var getByTag = document.getElementsByTagName.bind(document);
var getByClass = document.getElementsByClassName.bind(document);
var createElement = document.createElement.bind(document);

var rand = Math.random;
var ceil = Math.ceil;
var floor = Math.floor;

var log = console.log;
var info = console.info;
var warn = console.warn;

var delayedCall = TweenMax.delayedCall.bind(TweenMax);
