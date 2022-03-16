const print = () => {
  console.log(123);
};

// 防抖函数: 触发事件后在n秒内函数只能执行一次，如果在n秒内又触发了事件，则会重新计算函数执行的等待时间
// input
const debounce = (func, wait) => {
  let timer = null;
  return function () {
    let context = this;
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context);
    }, wait);
  };
};

document
  .querySelector('input')
  .addEventListener('input', debounce(print, 1000));

// 节流函数: 限制一个函数在n秒内只能执行一次
// resize、scroll
// 1.0 定时器写法
const throttle = (func, delay) => {
  let timer = null;
  return function () {
    // 如果timer存在，表示任务还在等待执行，暂时不改变timer的值
    if (timer) return;
    let context = this;
    timer = setTimeout(() => {
      // 判断触发的事件是否在时间间隔内，不在时间间隔内则触发事件
      func.apply(context);
      timer = null;
    }, delay);
  };
};

// 2.0 时间戳写法
function throttle2(fn, delay) {
  let pre = 0;
  return function () {
    let now = Date.now();
    if (now - pre >= delay) {
      pre = now;
      fn.apply(this, arguments);
    }
  };
}

document.addEventListener('resize', throttle(print, 1000));
