var Yapopup = require('./app');

(function($) {
	if ($.Yapopup || $.fn.yapopup) {
		console.warn('Yapopup or another plugin with similar name has been already setted');
	}
	$.Yapopup = Yapopup;
	$.fn.yapopup = function(options) {
		return this.each(function(index) {
			options = $.extend({}, options);
			options.index = index;
			options.$el = $(this);
			$.Yapopup.init(options);
		});
	};
})(jQuery);

window.l = function(x) {
	console.log(x);
};