// call、apply、bind的异同
// 共同点：
// 功能角度：三者都能改变 this 指向，且第一个传递的参数都是 this 指向的对象。
// 传参角度：三者都采用的后续传参的形式。
// 不同点：
// 传参方面： call 的传参是单个传递（序列），而 apply 后续传递的参 数是数组形式。而 bind 与call相同。
// 执行方面： call 和 apply 函数的执行是直接执行的，而 bind 函数会返回一个函数，然后我 们想要调用的时候才会执行。

/**
 *
 * @param {*} context context 为可选参数，如果不传的话默认上下文为 window
 * @param  {...any} args
 * @returns
 */

// call
Function.prototype.myCall = function (context, ...args) {
  if (typeof this !== 'function') {
    throw new TypeError('Error');
  }
  // 不传参默认为 window
  let ctx = context || window;
  ctx.fn = this; // this 指向调用myCall的function - test, 建议属性名使用Symbol()生成独一无二的键

  let result = ctx.fn(...args);
  delete ctx.fn;
  return result;
};

// apply
Function.prototype.myApply = function (context, args) {
  if (typeof this !== 'function') {
    throw new TypeError('Error');
  }
  // 不传参默认为 window
  let ctx = context || window;
  ctx.fn = this; // this 指向调用myCall的function - test, 建议属性名使用Symbol()生成独一无二的键
  let result = ctx.fn(...args); //调用函数
  delete ctx.fn; //删除context的函数属性
  return result;
};

// bind
Function.prototype.myBind = function (context, ...args1) {
  if (typeof this !== 'function') {
    throw new TypeError('Error');
  }
  let self = this;
  const boundFn = function (...args2) {
    return self.apply(this instanceof boundFn ? this : context, [
      ...args1,
      ...args2,
    ]);
  };
  // 修改返回函数的 prototype 为绑定函数的 prototype，实例就可以继承绑定函数的原型中的值
  boundFn.prototype = Object.create(this.prototype);
  // 必须设置回正确的构造函数，要不然在会发生判断类型出错
  boundFn.prototype.constructor = boundFn;
  return boundFn;
};

var obj = {
  name: 'zhangsan',
};

function test(age, age2, age3) {
  console.log(this.name + ',' + age + age2 + age3);
}

test.myCall(obj, 22);
test.myApply(obj, [22, 33, 44]);
test.myBind(obj, 2, 3, 4)();
