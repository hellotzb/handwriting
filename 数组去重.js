const arr = [1, 2, 3, 1, 1, 2, 5, 3, { id: 1 }, { id: 1 }, [1], [1]];

const unique = arr => {
  if (!Array.isArray(arr)) throw Error('type error');
  const obj = {};
  return arr.reduce((acc, val) => {
    // 如果数组中的元素是一个对象，则根据对象的id来判断是否是同一个对象
    if (Object.prototype.toString.call(val) === '[object Object]') {
      if (!obj[val.id]) {
        obj[val.id] = 1;
        acc.push(val);
      }
    } else if (Object.prototype.toString.call(val) === '[object Array]') {
      const id = JSON.stringify(val);
      if (!obj[id]) {
        obj[id] = 1;
        acc.push(val);
      }
    } else {
      if (!acc.includes(val)) {
        acc.push(val);
      }
    }
    return acc;
  }, []);
};

console.log(unique(arr));
