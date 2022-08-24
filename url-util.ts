const appendUrlParam = (url, key, val) => {
  if (url.indexOf(key) > -1) {
    return url.replace(new RegExp(`(${key})=([^&]*)`), `$1=${val}`);
  }
  return `${url}${url.indexOf('?') > -1 ? '&' : '?'}${key}=${val}`;
};
const appendUrlParams = (url, obj) => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      url = appendUrlParam(url, key, obj[key]);
    }
  }
  return url;
};

// 过滤url参数
const paramsFilter = (link?: string, deleteParams?: string[]) => {
  if (!link) return;
  const url = new URL(link);
  const param = url.searchParams;
  deleteParams?.forEach(deleteParam => {
    if (param.get(deleteParam)) {
      param.delete(deleteParam);
    }
  });
  return url.href;
};

// url search参数 -> 对象
// let url = "https://www.baidu.com?name=jimmy&age=18&height=1.88"
// queryString 为 window.location.search
const queryString = '?name=jimmy&age=18&height=1.88';
const queryParams = new URLSearchParams(queryString);
// 把键值对列表转换为一个对象。
const paramObj = Object.fromEntries(queryParams);
console.log(paramObj); // { name: 'jimmy', age: '18', height: '1.88' }
