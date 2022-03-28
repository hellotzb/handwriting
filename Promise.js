/**
 * https://github.com/yuanyuanbyte/Promise
 * 手写 Promise 核心原理，完整的 Promise/A+ 实现，通过了 Promise/A+ 官方872个测试用例测试
 * 按步分析 注释加持版
 */
class myPromise {
  // 用static创建静态属性，用来管理状态
  static PENDING = 'pending';
  static FULFILLED = 'fulfilled';
  static REJECTED = 'rejected';

  // 构造函数：通过new命令生成对象实例时，自动调用类的构造函数
  constructor(func) {
    // 给类的构造方法constructor添加一个参数func
    this.PromiseState = myPromise.PENDING; // 指定Promise对象的状态属性 PromiseState，初始值为pending
    this.PromiseResult = null; // 指定Promise对象的结果 PromiseResult
    this.onFulfilledCallbacks = []; // 保存成功回调
    this.onRejectedCallbacks = []; // 保存失败回调
    try {
      /**
       * func()传入resolve和reject，
       * resolve()和reject()方法在外部调用，这里需要用bind修正一下this指向
       * new 对象实例时，自动执行func()
       */
      func(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      // 生成实例时(执行resolve和reject)，如果报错，就把错误信息传入给reject()方法，并且直接执行reject()方法
      this.reject(error);
    }
  }

  resolve(result) {
    // result为成功态时接收的终值
    // 只能由pedning状态 => fulfilled状态 (避免调用多次resolve reject)
    if (this.PromiseState === myPromise.PENDING) {
      /**
       * 为什么resolve和reject要加setTimeout?
       * 2.2.4规范 onFulfilled 和 onRejected 只允许在 execution context 栈仅包含平台代码时运行.
       * 注1: 这里的平台代码指的是引擎、环境以及 promise 的实施代码。实践中要确保 onFulfilled 和 onRejected 方法异步执行，且应该在 then 方法被调用的那一轮事件循环之后的新执行栈中执行。
       * 这个事件队列可以采用“宏任务（macro-task）”机制，比如setTimeout 或者 setImmediate； 也可以采用“微任务（micro-task）”机制来实现， 比如 MutationObserver 或者process.nextTick。
       */
      setTimeout(() => {
        this.PromiseState = myPromise.FULFILLED;
        this.PromiseResult = result;
        /**
         * 在执行resolve或者reject的时候，遍历自身的callbacks数组，
         * 看看数组里面有没有then那边 保留 过来的 待执行函数，
         * 然后逐个执行数组里面的函数，执行的时候会传入相应的参数
         */
        this.onFulfilledCallbacks.forEach(callback => {
          callback(result);
        });
      });
    }
  }

  reject(reason) {
    // reason为拒绝态时接收的终值
    // 只能由pedning状态 => rejected状态 (避免调用多次resolve reject)
    if (this.PromiseState === myPromise.PENDING) {
      setTimeout(() => {
        this.PromiseState = myPromise.REJECTED;
        this.PromiseResult = reason;
        this.onRejectedCallbacks.forEach(callback => {
          callback(reason);
        });
      });
    }
  }

  /**
   * [注册fulfilled状态/rejected状态对应的回调函数]
   * @param {function} onFulfilled  fulfilled状态时 执行的函数
   * @param {function} onRejected  rejected状态时 执行的函数
   * @returns {function} newPromsie  返回一个新的promise对象
   */
  then(onFulfilled, onRejected) {
    /**
     * 参数校验：Promise规定then方法里面的两个参数如果不是函数的话就要被忽略
     * 所谓“忽略”并不是什么都不干，
     * 对于onFulfilled来说“忽略”就是将value原封不动的返回，
     * 对于onRejected来说就是返回reason，
     *     onRejected因为是错误分支，我们返回reason应该throw一个Error
     */
    onFulfilled =
      typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : reason => {
            throw reason;
          };

    // 2.2.7规范 then 方法必须返回一个 promise 对象
    let promise2 = new myPromise((resolve, reject) => {
      if (this.PromiseState === myPromise.FULFILLED) {
        /**
         * 为什么这里要加定时器setTimeout？
         * 2.2.4规范 onFulfilled 和 onRejected 只有在执行环境堆栈仅包含平台代码时才可被调用
         *  注1: 这里的平台代码指的是引擎、环境以及 promise 的实施代码。
         * 实践中要确保 onFulfilled 和 onRejected 方法异步执行，且应该在 then 方法被调用的那一轮事件循环之后的新执行栈中执行。
         * 这个事件队列可以采用“宏任务（macro-task）”机制，比如setTimeout 或者 setImmediate； 也可以采用“微任务（micro-task）”机制来实现， 比如 MutationObserver 或者process.nextTick。
         */
        setTimeout(() => {
          try {
            // 2.2.7.1规范 如果 onFulfilled 或者 onRejected 返回一个值 x ，则运行下面的 Promise 解决过程：[[Resolve]](promise2, x)，即运行resolvePromise()
            onFulfilled(this.PromiseResult);
          } catch (e) {
            // 2.2.7.2 如果 onFulfilled 或者 onRejected 抛出一个异常 e ，则 promise2 必须拒绝执行，并返回拒因 e
            reject(e); // 捕获前面onFulfilled中抛出的异常
          }
        });
      } else if (this.PromiseState === myPromise.REJECTED) {
        setTimeout(() => {
          try {
            onRejected(this.PromiseResult);
          } catch (e) {
            reject(e);
          }
        });
      } else if (this.PromiseState === myPromise.PENDING) {
        // pending 状态保存的 resolve() 和 reject() 回调也要符合 2.2.7.1 和 2.2.7.2 规范
        this.onFulfilledCallbacks.push(() => {
          try {
            onFulfilled(this.PromiseResult);
          } catch (e) {
            reject(e);
          }
        });
        this.onRejectedCallbacks.push(() => {
          try {
            onRejected(this.PromiseResult);
          } catch (e) {
            reject(e);
          }
        });
      }
    });

    return promise2;
  }
}

const test = () => {
  return new myPromise(resolve => {
    setTimeout(() => {
      resolve(123);
    }, 5000);
  });
};
test().then(res => {
  console.log(res);
});
