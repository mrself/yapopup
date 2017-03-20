global.l = function(x) {
	console.log(x);
};

global.chai = require('chai');
global.assert = chai.assert;
global.expect = chai.expect;
global.sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.should();
chai.use(sinonChai);


var spies = require('chai-spies');
chai.use(spies);
global.spy = chai.spy;

var jsdom = require('jsdom-global');

if (!global.isJsDomInited) {
	jsdom();
	global.$ = global.jQuery = require('jquery');
	global.isJsDomInited = true;
}
