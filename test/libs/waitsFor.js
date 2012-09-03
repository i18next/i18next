  ;(function (exports, undefined) {
    var WaitsFor, isNodeJS, waitsFor,
      __slice = Array.prototype.slice;
    
    isNodeJS = Boolean(typeof process !== "undefined" && process !== null ? process.pid : void 0);
    
    exports.VERSION = '0.0.7';
    
    WaitsFor = (function() {
    
      function WaitsFor(cond, message, timeout, interval) {
        var _this = this;
        this.cond = cond;
        if ((typeof this.cond) !== 'function') {
          throw new Error('WaitsFor: 1st argument must be a function');
        }
        if (arguments.length === 2) {
          timeout = message;
          message = null;
        }
        if (interval) this.interval(interval);
        if (timeout) {
          this.timeout(timeout);
          this.timeout_epoch = timeout + Date.now();
        }
        if (message) {
          this.message(message);
        } else {
          this.message(this.__message[0] + this.timeout() + this.__message[1], false);
        }
        this.delay_high(function() {
          return _this.initialize();
        });
      }
    
      WaitsFor.prototype.delay = function() {
        var args, fn, wait;
        fn = arguments[0], wait = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
        if (wait == null) wait = 0;
        return setTimeout((function() {
          return fn.apply(null, args);
        }), wait);
      };
    
      WaitsFor.prototype.initialize = function() {
        var that;
        if (this.init_already) return this;
        this.init_already = true;
        if (this.timeout() !== Infinity) {
          that = this;
          this.timeout_timer = setTimeout((function() {
            if (that.test_fin) return;
            that.test_fin = true;
            if (that.interval_timer) clearTimeout(that.interval_timer);
            return (that.runs())(new Error(that.message()), that.lastTest);
          }), this.timeout());
        }
        this.test(this);
        return this;
      };
    
      WaitsFor.prototype.init_already = false;
    
      WaitsFor.prototype._interval = 0;
    
      WaitsFor.prototype.interval = function(ms) {
        if (!arguments.length) return this._interval;
        if (this.init_already) {
          throw new Error('WaitsFor instance already initialized');
        }
        if (((ms === process.nextTick) || (ms === 'nextTick')) && isNodeJS) {
          this.test_timer = this.delay_high;
        } else {
          this.test_timer = this.delay;
          this._interval = ms;
        }
        return this;
      };
    
      WaitsFor.prototype.lastTest = void 0;
    
      WaitsFor.prototype.__message = ['<WaitsFor>.test: ', 'ms timeout exceeded'];
    
      WaitsFor.prototype._message = void 0;
    
      WaitsFor.prototype.message = function(msg, custom) {
        if (custom == null) custom = true;
        if (!arguments.length) return this._message;
        if (this.init_already) {
          throw new Error('WaitsFor instance already initialized');
        }
        if (custom) this.message_custom = true;
        this._message = msg;
        return this;
      };
    
      WaitsFor.prototype.message_custom = false;
    
      WaitsFor.prototype._runs = null;
    
      WaitsFor.prototype.runs = function(fn) {
        if (!arguments.length) return this._runs;
        if (this.init_already) {
          throw new Error('WaitsFor instance already initialized');
        }
        if ((typeof fn) !== 'function') {
          throw new Error('<WaitsFor>.runs: argument must be a function');
        }
        this._runs = fn;
        return this;
      };
    
      WaitsFor.prototype.test = function(that) {
        var err, test;
        if (that.test_fin) return;
        that.lastTest = test = that.cond();
        err = null;
        if ((!test) && (Date.now() > that.timeout_epoch)) {
          err = new Error(that.message());
        }
        if (test || err) {
          that.test_fin = true;
          if (that.timeout_timer) clearTimeout(that.timeout_timer);
          if (!that.runs()) {
            throw new Error('<WaitsFor>.test: runs function was undefined when triggered');
          }
          return (that.runs())(err, test);
        } else {
          return that.interval_timer = that.test_timer((function() {
            return that.test(that);
          }), that.interval());
        }
      };
    
      WaitsFor.prototype.test_fin = false;
    
      WaitsFor.prototype.interval_timer = void 0;
    
      WaitsFor.prototype._timeout = Infinity;
    
      WaitsFor.prototype.timeout = function(ms) {
        if (!arguments.length) return this._timeout;
        if (this.init_already) {
          throw new Error('WaitsFor instance already initialized');
        }
        this._timeout = ms;
        this.timeout_epoch = ms + Date.now();
        if (!this.message_custom) {
          this.message(this.__message[0] + this.timeout() + this.__message[1], false);
        }
        return this;
      };
    
      WaitsFor.prototype.timeout_epoch = Infinity;
    
      WaitsFor.prototype.timeout_timer = void 0;
    
      WaitsFor.factory = function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return (function(func, args, ctor) {
          ctor.prototype = func.prototype;
          var child = new ctor, result = func.apply(child, args);
          return typeof result === "object" ? result : child;
        })(this, args, function() {});
      };
    
      return WaitsFor;
    
    })();
    
    WaitsFor.prototype.delay_high = WaitsFor.prototype.delay;
    
    if (isNodeJS) {
      WaitsFor.prototype.delay_high = function() {
        var args, fn;
        fn = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        process.nextTick(function() {
          return fn.apply(null, args);
        });
      };
    }
    
    WaitsFor.prototype.test_timer = WaitsFor.prototype.delay;
    
    if (isNodeJS) WaitsFor.prototype.test_timer = WaitsFor.prototype.delay_high;
    
    WaitsFor.prototype.init = WaitsFor.prototype.initialize;
    
    WaitsFor.prototype["do"] = WaitsFor.prototype.runs;
    
    WaitsFor.prototype.does = WaitsFor.prototype.runs;
    
    WaitsFor.prototype.run = WaitsFor.prototype.runs;
    
    WaitsFor.prototype.then = WaitsFor.prototype.runs;
    
    WaitsFor.prototype.trigger = WaitsFor.prototype.runs;
    
    WaitsFor.prototype.triggers = WaitsFor.prototype.runs;
    
    exports.WaitsFor = WaitsFor;
    
    exports.waitsFor = waitsFor = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return WaitsFor.factory.apply(WaitsFor, args);
    };
    
    exports.await = waitsFor;
    
    exports.awaits = waitsFor;
    
    exports.wait = waitsFor;
    
    exports.waitFor = waitsFor;
    
    exports.waits = waitsFor;
    
    exports.when = waitsFor;
    
  })(this);
