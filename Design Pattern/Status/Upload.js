window.external.upload = function(state) {
  console.log(state);
};

var plugin = (function() {
  var plugin = documnet.createElement('embed');
  plugin.style.display = 'none';

  plugin.type = 'application/txftn-webkit';

  plugin.sign = function() {
    console.log('开始文件扫描');
  }

  plugin.pause = function() {
    console.log('暂停文件上传');
  }

  plugin.uploading = function() {
    console.log('开始文件上传');
  }

  plugin.del = function() {
    console.log('删除文件上传');
  }

  plugin.done = function() {
    console.log('文件上传完成');
  }

  document.body.appendChild(plugin);

  return plugin;
})();


var Upload = function(filename) {
  this.plugin = plugin;
  this.fileName = fileName;
  this.button1 = null;
  this.button2 = null;
  this.signState = new SignState(this);
  this.uploadingState = new UploadingState(this);
  //....
  this.currentState = this.signState;
}