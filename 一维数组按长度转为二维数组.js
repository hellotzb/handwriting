const group = (arr, len) => {
  const res = [];
  let index = 0;
  while (index < arr.length) {
    res.push(arr.slice(index, (index += len)));
  }
  return res;
};

group([1, 2, 3, 4, 5, 6], 3);
