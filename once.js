// 函数返回结果会被缓存下来，只会计算一次。
const once = fn => {
  let res,
    isFirst = true;
  return function (...args) {
    if (!isFirst) return res;
    res = fn.call(this, ...args);
    isFirst = false;
    return res;
  };
};

once(x => x)(2); // 2
once(x => x)(3); // 3
