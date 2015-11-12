'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var EventEmitter = (function () {
	function EventEmitter() {
		_classCallCheck(this, EventEmitter);

		this.observers = {};
	}

	_createClass(EventEmitter, [{
		key: 'on',
		value: function on(events, listener) {
			var _this = this;

			events.split(' ').forEach(function (event) {
				_this.observers[event] = _this.observers[event] || [];
				_this.observers[event].push(listener);
			});
		}
	}, {
		key: 'off',
		value: function off(event, listener) {
			var _this2 = this;

			if (!this.observers[event]) {
				return;
			}

			this.observers[event].forEach(function () {
				if (!listener) {
					delete _this2.observers[event];
				} else {
					var index = _this2.observers[event].indexOf(listener);
					if (index > -1) {
						_this2.observers[event].splice(index, 1);
					}
				}
			});
		}
	}, {
		key: 'emit',
		value: function emit(event) {
			for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				args[_key - 1] = arguments[_key];
			}

			if (this.observers[event]) {
				this.observers[event].forEach(function (observer) {
					observer.apply(undefined, args);
				});
			}

			if (this.observers['*']) {
				this.observers['*'].forEach(function (observer) {
					var _ref;

					observer.apply(observer, (_ref = [event]).concat.apply(_ref, args));
				});
			}
		}
	}]);

	return EventEmitter;
})();

module.exports = EventEmitter;