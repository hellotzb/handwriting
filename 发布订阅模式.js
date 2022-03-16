class EventEmitter {
  constructor() {
    this.events = {};
  }
  // 订阅 -> 向事件中心中添加事件
  on(event, cb) {
    if (this.events[event]) {
      this.events[event].push(cb);
    } else {
      this.events[event] = [cb];
    }
  }
  // 取消订阅
  off(event, cb) {
    if (this.events[event]) {
      events[eventName] = events[eventName].filter(callback => callback !== cb);
    }
  }
  // 发布 -> 调用事件中心中对应的函数
  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach(cb => cb && cb.apply(this, args));
    }
  }

  once(event, cb) {
    const func = (...args) => {
      cb.apply(this, args);
      this.off(event, func);
    };
    this.on(event, func);
  }
}

const emitter = new EventEmitter();

// 注册change事件
emitter.on('change', (...payload) => {
  console.log('change!!!', ...payload);
});

//触发change事件
emitter.emit('change', '参数1', '参数2');
