// OffLightState
var OffLightState = function(light) {
  this.light = light;
};

OffLightState.prototype.buttonWasPressed = function() {
  console.log('弱光');
  this.light.setState(this.light.weakLightState);
};

// WeakLightState
var WeakLightState = function(light) {
  this.light = light;
};

WeakLightState.prototype.buttonWasPressed = function() {
  console.log('强光');
  this.light.setState(this.light.strongLightState);
}

// StrongLightState

var StrongLightState = function(light) {
  this.light = light;
}

StrongLightState.prototype.buttonWasPressed = function() {
  console.log('关灯');
  this.light.setState(this.light.OffLightState);
}

var Light = function() {
  this.offLightState = new OffLightState(this);
  this.weakLightState = new WeakLightState(this);
  this.strongLightState = new StrongLightState(this);
  this.button = null;
}

Light.prototype.init = function() {
  var button = document.createElement('button'),
  self = this;
  this.button = document.body.appendChild(button);
  this.button.innerHTML = '开关';
  
  this.currState = this.offLightState;

  this.button.onclick = function() {
    self.currState.buttonWasPressed();
  }
}

Light.prototype.setState = function() {
  this.currState = newState;
};

var light = new Light();
light.init();