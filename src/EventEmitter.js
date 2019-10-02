class EventEmitter {
  constructor() {
    this.observers = {};
  }

  on(events, listener) {
    events.split(' ').forEach(event => {
      this.observers[event] = this.observers[event] || [];
      this.observers[event].push(listener);
    });
    return this;
  }

  off(event, listener) {
    if (!this.observers[event]) {
      return;
    }

    var observers = this.observers[event];
    for (var i = observers.length - 1; i >= 0; i--) {
      var observer = observers[i];
      if (observer === listener) {
        observers.splice(i, 1);
      }
    }
  }

  emit(event, ...args) {
    if (this.observers[event]) {
      const cloned = [].concat(this.observers[event]);
      cloned.forEach(observer => {
        observer(...args);
      });
    }

    if (this.observers['*']) {
      const cloned = [].concat(this.observers['*']);
      cloned.forEach(observer => {
        observer.apply(observer, [event, ...args]);
      });
    }
  }
}

export default EventEmitter;
