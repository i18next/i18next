
(function() {
  var assertions = {
    cssclass: function(className) {
      this.assert(this.obj.hasClass(className), 
                  "Expected element to have class " + className,
                  "Expected element to not have class " + className);
    },

    attr: function(attrName, expectedValue) {
      if (expectedValue)
        this.assert(this.obj.attr(attrName) == expectedValue,
                    "Expected element to have attribute '" + attrName + "' with value '" + expectedValue + "'",
                    "Expected element to have attribute '" + attrName + "' with value other than '" + expectedValue + "'"
                   );
      else
        this.assert(this.obj.attr(attrName),
                    "Expected element to have attribute " + attrName,
                    "Expected element to not have attribute " + attrName
                   );
    },

    id: function(id) {
      this.assert(this.obj.attr("id") === id,
                 "Expected element to have id '" + id + "'",
                 "Expected element to not have id '" + id + "'"
                 );
    },
    
    html: function(html) {
      this.assert(this.obj.html() === normalizeHtmlTagCase(html),
                  "Expected element to have html '" + html + "' but had '" + this.obj.html() + "'",
                  "Expected element to not have html '" + this.obj.html() + "'"
                 );
    },

    text: function(text) {
      if (text && $.isFunction(text.test)) {
        this.assert(text.test(this.obj.text()),
                    "Expected element text '" + this.obj.text() + "' to match regex '" + text.source + "'",
                    "Expected element text '" + this.obj.text() + "' to not match regex '" + text.source + "'"
                   );
      } else {
        this.assert(this.obj.text() == text,
          "Expected element to have text '" + text + "' but had '" + this.obj.text() + "'",
          "Expected element to not have text '" + this.obj.text() + "'"
        );
      }
    },

    value: function(value) {
      this.assert(this.obj.val() == value,
        "Expected element to have value '" + value + "' but had '" + this.obj.val() + "'",
        "Expected element to not have value '" + this.obj.val() + "'"
        );
    },
    
    
    data: function(key, expectedValue) {
      if (expectedValue)
        this.assert(this.obj.data(key) == expectedValue,
                    "Expected element to have data '" + key + "' with value '" + expectedValue + "'",
                    "Expected element to have data '" + key + "' with value other than '" + expectedValue + "'"
                   );
      else
        this.assert(this.obj.data(key) !== undefined,
                    "Expected element to have data " + key,
                    "Expected element to not have data " + key
                   );
    },
    
    visible: function() {
      this.assert(this.obj.is(":visible"),
                  "Expected element to be visible", 
                  "Expected element to not be visible" 
                 );
    },

    hidden: function() {
      this.assert(this.obj.is(":hidden"),
                  "Expected element to be hidden", 
                  "Expected element to not be hidden" 
                 );
    },

    selected: function() {
      this.assert(this.obj.is(":selected"),
                  "Expected element to be selected", 
                  "Expected element to not be selected" 
                 );
    },

    checked: function() {
      this.assert(this.obj.is(":checked"),
                  "Expected element to be checked", 
                  "Expected element to not be checked" 
                 );
    },

    empty: function() {
      this.assert(this.obj.is(":empty"),
                  "Expected element to be empty", 
                  "Expected element to not be empty" 
                 );
    },

    exist: function() {
      this.assert(this.obj.size() > 0,
                  "Expected element to exist", 
                  "Expected element to not exist" 
                 );
    },

    matchSelector: function(selector) {
      this.assert(this.obj.is(selector),
                              "Expected element to match selector '" + selector + "'", 
                              "Expected element to not match selector '" + selector + "'"
                             );
    },

    containChild: function(selector) {
      this.assert(this.obj.find(selector).size() > 0,
                  "Expected element to contain child '" + selector + "'", 
                  "Expected element to not contain child '" + selector + "'"
                 );
    },
    
    disabled: function() {
      this.assert(this.obj.is(":disabled"),
                  "Expected element to be disabled", 
                  "Expected element to not be disabled" 
                 );
    },

    handle: function(eventName) {
      var events = this.obj.data("events");
      this.assert(events && events[eventName] && events[eventName].length > 0,
                  "Expected element to handle event '" + eventName + "'", 
                  "Expected element to not handle event '" + eventName + "'" 
                 );
    },
   
    handleWith: function(eventName, eventHandler) {
      var stack = this.obj.data("events")[eventName]; 
      if (!stack) this.assert(false, "No events bound for '" + eventName + "'");
      var i;
      for (i = 0; i < stack.length; i++) {
        if (stack[i].handler == eventHandler) {
          return;
        }
      }

      this.assert(false, "No matching handler found for '" + eventName + "'");
    }

  };

  normalizeHtmlTagCase = function(html) {
    return $('<div/>').append(html).html();
  };

  if (typeof(expect) !== "undefined") {
    var assertionProtype;
    if (typeof(expect.Assertion) !== "undefined")
      assertionPrototype = expect.Assertion.prototype;

    for (var assertion in assertions) {
      if (!assertionPrototype[assertion.name])
        assertionPrototype[assertion] = assertions[assertion];
    }
  }
})();

