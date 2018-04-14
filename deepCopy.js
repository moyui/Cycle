//只能正确处理Number, String, Boolean, Array, 扁平对象
function jsonClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}


//定义一个辅助函数，用于在预定义对象的 Prototype 上定义方法：
function defineMethods(protoArray, nameToFunc) {
    protoArray.forEach(function(proto) {
        var names = Object.keys(nameToFunc),
            i = 0;
        for (; i < names.length; i++) {
            Object.defineProperty(proto, names[i], {
                enumerable: false,
                configurable: true,
                writable: true,
                value: nameToFunc[names[i]]
            });
        }
    });
}

//Object对象的处理
defineMethods([ Object.prototype ], {

//主要解释两个参数，srcStack和dstStack。它们的主要用途是对存在环的对象进行深复制。比如源对象中的子对象srcStack[7]在深复制以后，对应于dstStack[7]

    '$clone': function (srcStack, dstStack) {
        var obj = Object.create(Object.getPrototypeOf(this)),
            keys = Object.keys(this),
            index,
            prop;

        srcStack = srcStack || [];
        dstStack = dstStack || [];
        srcStack.push(this);
        dstStack.push(obj);

        for (var i = 0; i < keys.length; i++) {
            prop = this[keys[i]];
            if (prop === null || prop === undefined) {
                obj[keys[i]] = prop;
            }
            else if (!prop.$isFunction()) {
                if (prop.$isPlainObject()) {
                    index = srcStack.lastIndexOf(prop);
                    if (index > 0) {
                        obj[keys[i]] = dstStack[index];
                        continue;
                    }
                }
                obj[keys[i]] = prop.$clone(srcStack, dstStack);
            }
        }
        return obj;
    }
});
//Array的处理
defineMethods([ Array.prototype ], {
    '$clone': function (srcStack, dstStack) {
        var thisArr = this.valueOf(),
            newArr = [],
            keys = Object.keys(thisArr),
            index,
            element;

        srcStack = srcStack || [];
        dstStack = dstStack || [];
        srcStack.push(this);
        dstStack.push(newArr);

        for (var i = 0; i < keys.length; i++) {
            element = thisArr[keys[i]];
            if (element === undefined || element === null) {
                newArr[keys[i]] = element;
            } else if (!element.$isFunction()) {
                if (element.$isPlainObject()) {
                    index = srcStack.lastIndexOf(element);
                    if (index > 0) {
                        newArr[keys[i]] = dstStack[index];
                        continue;
                    }
                }
            }
            newArr[keys[i]] = element.$clone(srcStack, dstStack);
        }
        return newArr;
    }
});

//Date类型的处理
defineMethods([ Date.prototype ], {
    '$clone': function() { return new Date(this.valueOf()); }
});

//RegExp的处理
defineMethods([ RegExp.prototype ], {
    '$clone': function () {
        var pattern = this.valueOf();
        var flags = '';
        flags += pattern.global ? 'g' : '';
        flags += pattern.ignoreCase ? 'i' : '';
        flags += pattern.multiline ? 'm' : '';
        return new RegExp(pattern.source, flags);
    }
});

//Number, Boolean 和 String 的处理，这样能防止像单个字符串这样的对象错误地去调用Object.prototype.$clone
defineMethods([
    Number.prototype,
    Boolean.prototype,
    String.prototype
], {
    '$clone': function() { return this.valueOf(); }
});

//浅拷贝实现
function shallowCopy(target, source) {
  if (!source || typeof source !== 'object') {
    return;
  }
  if (!target || typeof target !== 'object') {
    return;
  }
  for (var key in source) {
    if (source.hasOwnProperty(key)) {
      target[key] = source[key];
    }
  }
}

//深拷贝实现
//主要问题在于要考虑到循环调用，prototype克隆？这就很难解决了
function DeepCopy(obj) {
  let map = new WeekMap();
function dp(obj) {
  let result = null;
  let keys = null,
      key = null,
      temp = null,
      existObj = null;
  
  existObj = map.get(obj);
  if (existObj) {
    return existObj;
  }
  keys = Object.keys(obj);
  result = {};
  map.set(obj,result);

  for (let i = 0; i < keys.length; i++) {
    key = keys[i];
    temp = obj[key];
    if (temp && typeof temp === 'object') {
      result[key] = dp(temp);
    } else {
      result[key] = temp;
    }
  }
  return result;
}
return dp(obj);
}