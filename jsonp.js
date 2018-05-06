function JSONP({  
  url,
  params,
  callbackKey,
  callback
}) {
  // 唯一 id，不存在则初始化
  JSONP.callbackId = JSONP.callbackId || 1
  params = params || {}
    // 传递的 callback 名，和下面预留的一致
  params[callbackKey] = `JSONP.callbacks[${JSONP.callbackId}]`
    // 不要污染 window
  JSONP.callbacks = JSONP.callbacks || []
    // 按照 id 放置 callback
  JSONP.callbacks[JSONP.callbackId] = callback
  const paramKeys = Object.keys(params)
  const paramString = paramKeys
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&')
  const script = document.createElement('script')
  script.setAttribute('src', `${url}?${paramString}`)
  document.body.appendChild(script)
    // id 占用，自增
  JSONP.callbackId++
}

function Jsop({url, params, callbackkey, callback}) {
  Jsop.callbackId = Jsop.callbackId || 1;
  params = params || {};
  params[callbackKey] = `JSONP.callbacks[${JSONP.callbackId}]`;
  Jsop.callbacks = Jsop.callbacks || [];
  const paramString = Object.keys(params).map(key => `${key}=${encodeURIComponent(params[key])}`).join('&');
  const script = document.createElement('script');
  script.setAttribute('src', `${url}?${paramString}`);
  document.body.appendChild(script);
  Jsop.callbackId++;
}




<script> 
    var url = "http://localhost:8080/crcp/rcp/t99eidt/testjson.do?jsonp=callbackfunction";  
    var script = document.createElement('script');  
    script.setAttribute('src', url);  //load javascript   
    document.getElementsByTagName('head')[0].appendChild(script);  

  //回调函数 
    function callbackfunction(data){ 
        var html=JSON.stringify(data.RESULTSET); 
alert(html); 
     } 
</script> 





JSONP({  
  url: 'http://s.weibo.com/ajax/jsonp/suggestion',
  params: {
    key: 'test',
  },
  callbackKey: '_cb',
  callback(result) {
    console.log(result.data)
  }
})