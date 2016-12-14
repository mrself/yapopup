'use strict';
var Del = require('ya-del');
require('./tabbable-selector');

function App () {
	this.$savedFocus = undefined;

	this.lastFocused = undefined;
}

App._name = 'yapopup';
App.defaults = {
	// If append to body
	bodyAppend: true,

	// Close button html
	close: '<button>x</button>',

	dName: 'b-popup'
};

App.KEY_CODES = {
	ESC: 27,
	TAB: 9,
	SHIFT: 65
};

App.make = function(options) {
	var inst = new this;
	inst.options = options;
	return inst;
};

App.init = function(options) {
	var inst = this.make(options);
	if (inst) inst.init();
	return inst;
};

App.prototype = $.extend({}, Del, {
	constructor: App,
	init: function() {
		this.setOptions();
		this.setEl();
		this.name = this.constructor._name;
		this.defineId();
		this.initDel({dName: this.options.dName});
		this.defineEls();
		this.defineEvents();
		this.setAria();
	},

	setOptions: function() {
		this.options = $.extend(true, {}, this.constructor.defaults, this.options);
	},

	setEl: function() {
		if (!this.options.$el || this.options.$el.length !== 1)
			throw new Error('$el options must be defined and exist in DOM');
		this.$el = this.options.$el;
	},

	defineId: function() {
		this.id = this.$el.attr('id');
		if (!this.id) throw new Error('There is no id in popup el');
	},

	defineEls: function() {
		this.$content = this.find('content');
		this.defineTrigger();
		this.defineClose();
	},

	defineTrigger: function() {
		this.$trigger = $('[data-yapopup-target=' + this.id + ']');
	},

	defineClose: function() {
		this.$close = this.find('close');
		if (!this.$close.length) {
			this.$close = $(this.options.close)
				.addClass(this.makeName('close'))
				.appendTo(this.$content);
		}
	},

	defineEvents: function() {
		var self = this;
		this.$el.on('keyup.' + this.name, function(e) {
			self.checkEsc(e);
		});
		this.$trigger.on('click.' + this.name, function(e) {
			e.preventDefault();
			self.open();
		});
		this.$close.on('click', function(e) {
			e.preventDefault();
			self.close();
		});
		this.$el.on('focusout', function(e) {
			self.onFocusOut(e);
		});
		this.$el.on('focusin', function(e) {
			self.onFocusIn(e);
		});
	},

	setAria: function() {
		this.$el.attr('role', 'dialog');
	},

	open: function() {
		this.saveFocus();
		this.show();
		this.ariaShow();
		this.focusIn();
	},

	close: function() {
		this.hide();
		this.restorefocus();
		this.ariaHide();
	},

	ariaShow: function() {
		this.$el.attr('aria-hidden', false);
	},

	ariaHide: function() {
		this.$el.attr('aria-hidden', true);
	},

	show: function() {
		this.addMod('show');
	},

	hide: function() {
		this.removeMod('show');
	},

	focusIn: function() {
		this.$el.find(':tabbable').first().focus();
	},

	saveFocus: function() {
		this.$savedFocus = $(':focus');
	},

	restorefocus: function() {
		this.$savedFocus.focus();
	},

	checkEsc: function(e) {
		if (e.keyCode == this.constructor.KEY_CODES.ESC)
			this.close();
	},

	onFocusIn: function(e) {
		this.lastFocused = e.target;
	},

	onFocusOut: function() {
		var $tabbable = this.$el.find(':tabbable');
		if (this.lastFocused) {
			var $lastTabbable = $tabbable.last();
			if ($lastTabbable[0] === this.lastFocused) {
				$tabbable.first().focus();
			} else $lastTabbable.focus();
		} else {
			$tabbable.last().focus();
		}
	}
});

module.exports = App;