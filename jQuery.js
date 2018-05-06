(function(ROOT) {
  const jQuery = function(selector) {
    return new jQuery.fn.init(selector);
  };

  jQuery.fn = jQuery.prototype = {
    constructor: jQuery,
    version: '1.0.0',
    init: function(selector) {
      let ele = document.querySelector(selector);
      this[0] = ele;

      return this;
    },

    toArray: function() {}
  },
  jQuery.fn.init.prototype = jQuery.fn;
  jQuery.extend = jQuery.fn.extend = function(options) {
    let target = this;
    let copy;

    for(let name in options) {
      copy = options[name];
      target[name] = copy;
    }

    return target;
  }

  jQuery.extend({
    isFunction: function() {},
  })

  jQuery.fn.extend({
    queue: function() {},
  })

  ROOT.jQuery = ROOT.$ = jQuery;
})(window);