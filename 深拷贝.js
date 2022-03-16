// https://mp.weixin.qq.com/s/A42Y3pXJTBAu7fCXjndMjQ
// 原生的深拷贝API: structuredClone
// https://developer.mozilla.org/en-US/docs/Web/API/structuredClone

// 1.0 简易递归版本 - 问题：如果存在对象循环引用问题会出现栈内存溢出
const deepClone = target => {
  if (typeof target === 'object') {
    let cloneTarget = Array.isArray(target) ? [] : {};
    for (const key in target) {
      cloneTarget[key] = deepClone(target[key]);
    }
    return cloneTarget;
  } else {
    return target;
  }
};

// WeakMap 对象是一组键/值对的集合，其中的键是弱引用的。其键必须是对象，而值可以是任意的。
// 弱引用: 在计算机程序设计中，弱引用与强引用相对，是指不能确保其引用的对象不会被垃圾回收器回收的引用。一个对象若只被弱引用所引用，则被认为是不可访问（或弱可访问）的，并因此可能在任何时刻被回收。
// 2.0
const deepClone1 = (target, map = new WeakMap()) => {
  if (typeof target === 'object') {
    let cloneTarget = Array.isArray(target) ? [] : {};
    if (map.get(target)) {
      return target;
    }
    map.set(target, cloneTarget);
    for (const key in target) {
      cloneTarget[key] = deepClone1(target[key], map);
    }
    return cloneTarget;
  } else {
    return target;
  }
};
