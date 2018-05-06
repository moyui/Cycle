(function() {
  var imgList;
  var delay;
  var offset;
  var time;
  var _selector;

  function _isShow(el) {
    var coords = el.getBoundingClientRect();
    return ((coords.top >= 0 && coords.left >= 0 && coords.top) <= (window.innerHeight || document.documentElement.clientHeight + parseInt(offset))) 
  }

  function _loadImage() {
    for (var i=imgList.length; i--;) {
      var el = imgList[i];
      if (_isShow(el)) {
        el.src = el.getAttribute('data-src');
        el.className = el.className.replace(new RegExp("(\\s|^)") + _selector.substring(1, _selector.length) + "(\\s|$)"), " ");
        imgList.splice(i, 1);
      }
    }
  }

  function _delay() {
    clearTimeout(delay);
    delay = setTimeout(function() {
      _loadImage();
    }, time);
  }

  function ImageLazyLoad(selector, options) {
    var defaults = options || {};
    offset = defaults.offset || 0;
    time = defaults.time || 250;
    _selector = selector || '.m-lazyload';

    this.getNode();

    _delay();
    if (defaults.isScoll) {
      defaults.isScoll.on('scroll', _delay);
      defaults.isScoll.on('scrollEnd', _delay);
    } else {
      window.addEventListener('scroll', _delay, false);
    }
  }

  ImageLazyLoad.prototype = {
    constructor:  ImageLazyLoad,

    getNode: function() {
      imgeList = [];
      var nodes = document.querySelectorAll(_selector);
      for(var i = 0, i = nodes.length; i < l; i++) {
        imgList.push(nodes[i]);
      }
    }
  }
})();