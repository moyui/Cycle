var Folder = function(name) {
  this.name = name;
  this.parent = null;
  this.files = [];
};

Folder.prototype.add = function(file) {
  file.parent = this;
  this.files.push(file);
};

Folder.prototype.scan = function() {
  console.log('开始扫描文件夹');
  for (var i = 0, file, files = this.files; file = this.files[i++];) {
    file.scan();
  }
}
Folder.prototype.remove = function() {
  if (!this.parent) {
    return;
  } 
  for (var files = this.parent.files, l = files.length - 1; l > 0; l--) {
    var file = file[l];
    if (file === this) {
      file.splice(l,1);
    }
  }
}


var File = function(name) {
  this.name = name;
};

File.prototype.add = function() {
  throw new Error('文件下面不能再添加组件');
};

File.prototype.scan = function() {
  console.log('开始扫描文件' + this.name);
};

File.prototype.remove = function() {
  if (!this.parent) {
    return;
  } 
  for (var files = this.parent.files, l = files.length - 1; l > 0; l--) {
    var file = file[l];
    if (file === this) {
      file.splice(l,1);
    }
  }
}