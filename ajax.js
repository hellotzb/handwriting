/** ajax
 * 1. 创建一个异步对象xhr -> XMLHttpRequest
 * 2. 设置请求方式和请求地址 -> xhr.open(method, url, async) -> async表示是否异步执行操作，默认为true
 * 3. 发送请求 -> xhr.send(body)
 * 4. 监听状态的变化 -> xhr.onreadystatechange()
 */

/** readyState
 * 0：未初始化 -- 尚未调用.open()方法；
 * 1：启动 -- 已经调用open()方法，但尚未调用.send()方法；
 * 2：发送 -- 已经调用send()方法，但尚未接收到响应；
 * 3：接收 -- 已经接收到部分响应数据；
 * 4：完成 -- 已经接收到全部响应数据，而且已经可以在客户端使用了；
 */

// obj -> string
const objToString = data => {
  data.t = new Date().getTime();
  let res = [];
  for (let key in data) {
    //需要将key和value转成非中文的形式，因为url不能有中文。使用encodeURIComponent();
    res.push(encodeURIComponent(key) + ' = ' + encodeURIComponent(data[key]));
  }
  return res.join('&');
};

// type, url ,data ,timeout ,success ,error 将所有参数换成一个对象
function ajax(option) {
  //  0.将对象转换成字符串
  let str = objToString(option.data);
  //  1.创建一个异步对象xhr；
  let xhr, timer;
  // 兼容处理
  if (window.XMLHttpRequest) {
    xhr = new XMLHttpRequest();
  } else {
    // code for IE6, IE5
    xhr = new ActiveXObject('Microsoft.XMLHTTP');
  }
  //  2.设置请求方式和请求地址；
  // 判断请求的类型是POST还是GET
  if (option.type.toLowerCase() === 'get') {
    xhr.open(option.type, option.url + '?t=' + str, true);
    //  3.发送请求；
    xhr.send();
  } else {
    xhr.open(option.type, option.url, true);
    // 注意：post请求中必须在open和send之间添加HTTP请求头：setRequestHeader(header,value);
    // value: 具体的数据类型，常用"application/x-www-form-urlencoded"和"application/json"
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    //  3.发送请求；
    // 请求头如果设置 application/json ,send()参数需传入json对象
    xhr.send(str);
  }
  //  4.监听状态的变化；
  // 可以用 onload 来代替 onreadystatechange 等于4的情况，因为onload只在状态为4的时候才被调用
  xhr.onreadystatechange = function () {
    clearInterval(timer);
    if (xhr.readyState === 4) {
      // xhr.status 获取http状态码
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
        //  5.处理返回的结果；
        option.success(xhr); //成功后回调；
      } else {
        option.error(xhr); //失败后回调；
      }
    }
  };

  //判断外界是否传入了超时时间
  if (option.timeout) {
    timer = setInterval(function () {
      xhr.abort(); //中断请求
      clearInterval(timer);
    }, timeout);
  }
}
