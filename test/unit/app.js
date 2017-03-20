require('base');
var App = require('app');
var proto = App.prototype;

before(function() {
	global.$ = require('jquery');
});

afterEach(function() {
	for (var key in App) {
		var m = App[key];
		m.restore && m.restore();
	}
	for (var key in App.prototype) {
		var m = App.prototype[key];
		m.restore && m.restore();
	}
});

describe('.make', function() {
	it('return plugin instance if $el options exists', function() {
		var $el = $('<div>');
		var actual = App.make({$el: $el});
		expect(actual).to.an.instanceof(App);
	});
});

describe('.init', function() {
	it('call .make', function() {
		var instance = {
			init: function() {}
		};
		var make = sinon.stub(App, 'make').returns(instance);
		var args = {prop: 'value'};
		App.init(args);
		make.should.have.been.calledWith(args);
	});

	describe('return .make result', function() {
		it('if a result is null', function() {
			var make = sinon.stub(App, 'make').returns(null);
			expect(App.init()).to.be.null;
		});

		it('if a result is an instance', function() {
			var instance = {
				init: function() {}
			};
			var make = sinon.stub(App, 'make').returns(instance);
			expect(App.init()).to.eql(instance);
		});
	});
});

describe('#setOptions', function() {
	it('extend default options', function() {
		var context = {
			options: {prop: 'value'},
			constructor: {defaults: {prop1: 'value1'}}
		};
		proto.setOptions.call(context);
		expect(context.options).to.eql({
			prop: 'value',
			prop1: 'value1'
		});
	});
});

describe('setEl', function() {
	it('throw if $el option does not exist', function() {
		var context = {
			options: {}
		};
		expect(proto.setEl.bind(context)).to.throw();
	});

	it('throw if $el length is not equal to 1', function() {
		var $el = $('.alian');
		var context = {
			options: {$el: $el}
		};
		expect(proto.setEl.bind(context)).to.throw();
	});

	it('set $el property if $el exists and has length 1', function() {
		var $el = $('<div>');
		var context = {
			options: {$el: $el}
		};
		proto.setEl.call(context);
		expect(context.$el[0]).to.eql($el[0]);
	});
});

describe('#defineId', function() {
	it('set id property if element has id', function() {
		var $el = $('<div id="id"></div/>');
		var context = {$el: $el};
		proto.defineId.call(context);
		expect(context.id).to.eql('id');
	});
});