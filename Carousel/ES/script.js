var body = document.getElementsByTagName('body')[0];
var banner = document.getElementsByClassName('banner');
var span = document.getElementsByClassName('tab')[0].getElementsByTagName('span');
var next = document.getElementsByClassName('perv')[0];
var on = document.getElementsByClassName('on')[0];

banner[0].style.opacity = '1';
span[0].className = 'on';
var num = 0;

for (var i = 0;i < span.length; i++) {
  span[i].index = i;
  span[i].onclick = function() {
    for (var j = 0; j < span.length; j++) {
      num = this.index;
      span[j].className = '';
      banner[j].style.opacity = '0';
    }
    span[num].className = 'on';
    banner[num].style.opacity = '1';
  }
}

next.onclick = function() {
  for (var j = 0; j < span.length; j++) {
    if (span[j].className === 'on') {
      span[j].className = '';
      banner[j].style.opacity = '0';
      j--;
      num--;
      if (j < 0) {
        j = 4;
      }
      span[j].className = 'on';
      banner[j].style.opacity = '1';
    }
  }
}

function Time() {
  num++;
  if (num < 5) {
    for (var j = 0; j < span.length; j++) {
      span[j].className = '';
      banner[j].style.opacity = '0';
    }
    span[num].className = 'on';
    banner[num].style.opacity = '1';
  } else {
    num = -1;
  }
}

clearInterval(timer);
var timer = setInterval("Time()",2000);/*调用定时器*/

oBody.onmouseover = function(){/*鼠标引入，清除定时器，轮播图停止*/
    clearInterval(timer);
};
oBody.onmouseout = function(){/*鼠标移出，重新调用定时器，轮播图开始*/
    clearInterval(timer);
     timer = setInterval("Time()",2000);
};