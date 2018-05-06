function ajax(options) {
  'use strict';
  let url = options.url;
  const method = options.method.toLowerCase() || 'get';
  const async = options.async !== false;
  const data = options.data;
  const xhr = new XMLHttpRequest();

  if (options.timeout && options.timeout > 0) {
    xhr.timeout = options.timeout;
  }

  return new Promise((resolve, reject) => {
    xhr.ontimeout = () => reject && reject('请求超时');
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
          resolve && resolve(xhr.responseText);
        } else {
          reject && reject();
        }
      }
    }

    xhr.onerror = error => reject && reject(error);

    let paramArr = [];
    let encodeData;
    if (data instanceof Object) {
      for (let key of Object.keys(data)) {
        paramArr.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
      }
      encodeData = paramArr.join('&');
    }

    if (method === 'get') {
      const index = url.indexOf('?')
      if (index === -1) url += '?'
      else if (index !== url.length - 1) url += '&'
      url += encodeData
    }

    xhr.open(method, url, async);
    if (method === 'get') xhr.send(null);
    else {
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencode;charset="utf-8"');
      xhr.send(encodeData);
    }
  })
}