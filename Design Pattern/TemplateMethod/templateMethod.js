var Beverage = function() {};

Beverage.prototype.boilWater = function() {
  console.log('把水煮沸');
};

Beverage.prototype.brew = function() {
  throw new Error('子类必须重写brew方法');//接口检查
};//由子类重写

Beverage.prototype.pourInCup = function() {};

Beverage.prototype.addCondiments = function() {};

Beverage.prototype.customerWantsCondiments = function() {//钩子函数
  return true;
}

Beverage.prototype.init = function() { //模板方法
  this.boilWater();
  this.brew();
  this.pourInCup();
  if (this.customerWantsCondiments()) {
    this.addCondiments();
  }
};

var Coffee = function() {};

Coffee.prototype = new Beverage();

Coffee.prototype.brew = function() {
  console.log('用沸水冲泡咖啡');
};

Coffee.prototype.pourInCup = function() {
  console.log('把咖啡倒进杯子');
}

Coffee.prototype.addCondiments = function() {
  console.log('加糖和牛奶');
}

Coffee.prototype.customerWantsCondiments = function() {
  return window.confirm(`请问需要调料嘛?`);
}

var Coffee = new Coffee();
Coffee.init();