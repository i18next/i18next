// the listeners passed to once(): off() looks for their wrappers, and stays O(1) for all others
const onceListeners = new WeakSet();

class EventEmitter {
  constructor() {
    // This is an Object containing Maps:
    //
    // { [event: string]: Map<listener: function, numTimesAdded: number> }
    //
    // We use a Map for O(1) insertion/deletion and because it can have functions as keys.
    //
    // We keep track of numTimesAdded (the number of times it was added) because if you attach the same listener twice,
    // we should actually call it twice for each emitted event.
    this.observers = {};
  }

  on(events, listener) {
    events.split(' ').forEach((event) => {
      if (!this.observers[event]) this.observers[event] = new Map();
      const numListeners = this.observers[event].get(listener) || 0;
      this.observers[event].set(listener, numListeners + 1);
    });
    return this;
  }

  off(events, listener) {
    // like on(), a string lists events separated by spaces; anything else is looked up as it is
    (typeof events === 'string' ? events.split(' ') : [events]).forEach((event) => {
      if (!this.observers[event]) return;
      if (!listener) {
        delete this.observers[event];
        return;
      }

      this.observers[event].delete(listener);
      if (onceListeners.has(listener)) {
        this.observers[event].forEach((_, observer) => {
          if (observer.listener === listener) this.observers[event].delete(observer);
        });
      }
    });
  }

  once(event, listener) {
    const wrapper = (...args) => {
      // removed first, so a listener that emits the same event again or throws still runs once
      this.off(event, wrapper);
      listener(...args);
    };
    wrapper.listener = listener;
    onceListeners.add(listener);
    this.on(event, wrapper);
    return this;
  }

  emit(event, ...args) {
    if (this.observers[event]) {
      const cloned = Array.from(this.observers[event].entries());
      cloned.forEach(([observer, numTimesAdded]) => {
        for (let i = 0; i < numTimesAdded; i++) {
          observer(...args);
        }
      });
    }

    if (this.observers['*']) {
      const cloned = Array.from(this.observers['*'].entries());
      cloned.forEach(([observer, numTimesAdded]) => {
        for (let i = 0; i < numTimesAdded; i++) {
          observer(event, ...args);
        }
      });
    }
  }
}

export default EventEmitter;
