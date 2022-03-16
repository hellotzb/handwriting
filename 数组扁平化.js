// 使用 Infinity，可展开任意深度的嵌套数组
const arr = [1, 2, [3, 4, [5, 6, [7, 8, [9, 10]]]]];
arr.flat(Infinity); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// flat() 方法会移除数组中的空项
const arr2 = [1, 2, , 4, 5];
arr2.flat(); // [1, 2, 4, 5]

const flatten = arr => {
  // result为之前的计算结果，item为数组的各项值
  return arr.reduce((result, item) => {
    return result.concat(Array.isArray(item) ? flatten(item) : item);
  }, []);
};
flatten(arr); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
