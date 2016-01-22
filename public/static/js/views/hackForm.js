'use strict';

/**
 * hackForm - Custom form validator
 *
 * TODO:
 * 	- multiple validators like: max[10]|email
 * 	- filters like : toUpper|toLower|trim
 * 	- fadeOut/in for end()
 */

(function ($) {
	'use strict';

	$.hackForm = {};
	var validators = $.hackForm.validators = {
		email: function email(val) {
			var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
			return re.test(val);
		}
	};

	// let filters = $.hackForm.filters = {
	// 	toUpper:
	// 	max:
	// };

	$.widget('hackForm.hackField', {
		options: {
			validator: undefined, // name or function(val) { return isValid }
			required: false
		},

		_create: function _create() {
			var _this = this;

			var o = this.options;
			var e = this.element;

			if (!o.validator || !$.isFunction(o.validator) && !$.isFunction(validators[o.validator])) {
				throw new Error('Invalid or missing type/validator: ' + o.validator);
			}

			this.invalid = false;
			this.label = o.label || e.closest('form').find('label[for="' + e.attr('id') + '"]');

			e.on('change', function () {
				_this.validate();
			}).on('keydown', function () {
				if (_this.invalid) {
					_this.update();
				}
			});
		},

		update: function update() {
			var _this2 = this;

			if (this.updateTimeout) {
				clearTimeout(this.updateTimeout);
			} else {
				setTimeout(function () {
					_this2.validate();
				}, 100);
			}
		},
		validate: function validate() {
			var e = this.element;
			var o = this.options;
			var val = undefined,
			    valid = undefined;

			// Get value
			val = this.get();

			// Validate
			if (o.required && !val) {
				valid = false;
			} else if ($.isFunction(o.validator)) {
				valid = this.validator(val);
			} else {
				valid = validators[o.validator](val);
			}

			// Update UI
			this.label.toggleClass('hackfield-error', !valid);
			e.toggleClass('hackfield-error', !valid);

			if (this.invalid && valid) {
				// Validity fixed
				this.invalid = valid;
				this.trigger('correction');
			}

			return valid;
		},

		get: function get() {
			var e = this.element;
			var o = this.options;

			if ($.isFunction(o.get)) {
				return o.get();
			} else {
				return e.val().trim();
			}
		}
	});

	$.widget('hackForm.hackForm', {
		options: {
			fields: [],
			successMessage: {
				title: 'Success!',
				subtitle: undefined
			},
			failureMessage: {
				title: 'An unexpected error has occured!',
				subtitle: 'Refresh this window and try resubmitting.'
			},
			fadeTime: 500
		},

		_create: function _create() {
			var _this3 = this;

			var e = this.element;
			var o = this.options;

			this.submitBtn = e.find('button[type="submit"]');

			// Construct fields
			this.fields = [];
			o.fields.forEach(function (field) {
				if (!field.element) {
					throw new Error('Missing field element');
				}

				var $field = $(field.element);

				if ($field.length !== 1) {
					throw new Error('Missing or duplicate elements found for field');
				}

				_this3.fields.push($field.hackField({
					validator: field.validator,
					label: field.label,
					required: field.required || $field.prop('required')
				}));
			});

			// Handle error correction for all fields
			this.valid = false;
			e.on('correction', function (ev) {
				ev.preventDefault();
				if (!_this3.valid) {
					(function () {
						var numInvalid = 0;
						_this3.fields.forEach(function (field) {
							if (field.is('.hackField-error')) {
								++numInvalid;
							}
						});

						if (numInvalid === 0) {
							_this3.valid = false;
							_this3.trigger('correction');
						}
					})();
				}
			});
		},

		validate: function validate() {
			var valid = true;

			this.fields.forEach(function (field) {
				if (!field.hackField('validate')) {
					valid = false;
					return false;
				}
			});
			this.valid = valid;

			return valid;
		},

		get: function get() {
			var vals = {};
			var name = undefined;

			this.fields.forEach(function (field) {
				name = field.attr('name');
				if (!name || vals[name]) {
					throw new Error('Missing or duplicate field name attribute');
				}

				vals[name] = field.hackField('get');
			});

			return vals;
		},

		/**
   * Called after ajax submission
   * - Specific to site
   */
		end: function end(err) {
			var e = this.element;
			var o = this.options;
			var message = err ? o.failureMessage : o.successMessage;
			var html = undefined;

			// Get predefined message

			// Clean out form of non-end messages
			html = e.find('.hackform-' + (err ? 'failure' : 'success'));
			e.children().not(html).remove();
			html.show();

			console.log(html);

			if (html.length === 0) {
				if (err) {
					message.subtitle = err;
				}

				e.append('<div class="form-complete">' + (message.title ? '<h2>' + message.title + '</h2>' : '') + (message.subtitle ? '<p>' + message.subtitle + '</p>' : '') + '</div>');
			}
		}
	});
})(jQuery);
//# sourceMappingURL=hackForm.js.map
