Function.prototype.before = function(breforefn) {
  var _self = this;
  return function() {
    breforefn.apply(this, arguments);
    _self.apply(this, arguments);
  }
}

Function.prototype.after = function(afterfn) {
  var _self = this;
  return function() {
    _self.apply(this, arguments);
    afterfn.apply(this, arguments);
  }
}

var before = function(fn, beforefn) {
  return function() {
    breforefn.apply(this, arguments);
    return fn.apply(this, arguments);
  }
}

/* 例子 */
Function.prototype.before = function(breforefn) {
  var _self = this;
  return function() {
    if (before.apply(this, arguments) === false) {
      return;
    }
    return _self.apply(this, arguments);
  }
}

var validata = function() {
  if (username.value === '') {
    alert('用户名不能为空');
    return false;
  }
  if (password.value === '') {
    alert('密码不能为空');
    return false;
  }
}

var formSubmit = function() {
  var param = {
    username: username.value,
    password: password.value
  }
  ajax('http:// xxx.com/login', param);
}

formSubmit = formSubmit.before(validata);

submitBtn.onclick = function() {
  formSubmit();
}