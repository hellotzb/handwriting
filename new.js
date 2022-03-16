const createObject = Con => {
  // 创建新对象obj
  // var obj = {};
  var obj = Object.create(null);

  // 将obj.__proto__ -> 构造函数原型
  // (不推荐)obj.__proto__ = Con.prototype
  Object.setPrototypeOf(obj, Con.prototype);

  // 执行构造函数，并接受构造函数返回值
  const ret = Con.apply(obj, Array.prototype.slice.call(arguments, 1));

  // 若构造函数返回值为对象，直接返回该对象
  // 否则返回obj
  return Object.prototype.toString.call(ret) === '[object Object]' ? ret : obj;
};
