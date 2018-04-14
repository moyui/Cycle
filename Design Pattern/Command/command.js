var setCommand = function(button, command) {
  button.onclick = function() {
    command.execute();
  }
};

var MenuBar = {
  refresh: function() {
    console.log('刷新菜单页面');
  }
};

var RefreshMenuBarCommand = function(receiver) {
  return {
    execute: function() {
      receiver.refresh();
    }
  }
};

var refreshMenuBarCommand = RefreshMenuBarCommand(MenuBar);
setCommand(button1, refreshMenuBarCommand);