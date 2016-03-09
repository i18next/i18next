class EventEmitter{
	constructor() {
		this.observers = {};
	}

	on(events, listener) {
		events.split(' ').forEach((event) => {
			this.observers[event] = this.observers[event] || [];
			this.observers[event].push(listener);
		});
	}

	off(event, listener) {
		if (!this.observers[event]) {
			return;
		}

		this.observers[event].forEach(() => {
			if (!listener) {
				delete this.observers[event];
			} else {
				var index = this.observers[event].indexOf(listener);
				if (index > -1) {
					this.observers[event].splice(index, 1);
				}
			}
		});
	}

	emit(event, ...args) {
		if (this.observers[event]) {
			this.observers[event].forEach(function(observer) {
				observer(...args);
			});
		}

		if (this.observers['*']) {
			this.observers['*'].forEach(function(observer) {
				observer.apply(observer, [event].concat(...args));
			});
		}
	}
}

export default EventEmitter;
