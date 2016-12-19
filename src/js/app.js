'use strict';
var Del = require('ya-del');
require('./tabbable-selector');

function App () {
	this.$savedFocus = undefined;

	this.lastFocused = undefined;

	this.state = false; // false - close, true - open
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
		this.$inner = this.find('inner');
		this.$body = $(document.body);
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
				.appendTo(this.$inner);
		}
	},

	defineEvents: function() {
		var self = this;
		this.$el.on('click.' + this.name, function(e) {
			self.onClick(e);
		});
		this.$trigger.on('click.' + this.name, function(e) {
			e.preventDefault();
			self.open();
		});
		$(document).on('focusin.' + this.name, function(e) {
			self.onDocumenFocus(e);
		}).on('keyup.' + this.name, function(e) {
			self.checkEsc(e);
		});
	},

	setAria: function() {
		this.$el.attr('role', 'dialog');
	},

	open: function() {
		this.$body.addClass(this.options.dName + 'BodyOverflow');
		this.saveFocus();
		this.show();
		this.ariaShow();
		this.focusIn();
		this.$el.trigger('open.' + this.name);
		this.state = true;
	},

	close: function() {
		this.$body.removeClass(this.options.dName + 'BodyOverflow');
		this.hide();
		this.restorefocus();
		this.ariaHide();
		this.$el.trigger('close.' + this.name);
		this.state = false;
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

	onClick: function(e) {
		if (e.target === this.$close[0]) this.close();
		else if (!$.contains(this.$inner[0], e.target) && this.$inner[0] !== e.target) {
			this.close();
		}
	},

	checkEsc: function(e) {
		if (!this.state) return;
		if (e.keyCode == this.constructor.KEY_CODES.ESC)
			this.close();
	},

	onDocumenFocus: function(e) {
		if (!this.state) return;
		if ($.contains(this.$el[0], e.target)) this.lastFocused = e.target;
		else {
			this.setFocusIn();
		}
	},

	/**
	 * Back focus in a popup
	 */
	setFocusIn: function() {
		var $tabbable = this.$el.find(':tabbable');
		var $lastTabbable = $tabbable.last();
		if (this.lastFocused === $lastTabbable[0]) {
			$tabbable.first().focus();
		} else $lastTabbable.focus();
	},
});

module.exports = App;