// Subject 主题
class Subject {
  constructor() {
    this.observers = []; // 存放观察者
  }
  // 添加观察者
  attachObserver(observer) {
    this.observers.push(observer);
  }
  // 移除观察者
  deleteObserver(observer) {
    console.log(observer, ' have deleted~~');
    const idx = this.observers.indexOf(observer);
    ~idx && this.observers.splice(idx, 1);
  }
  // 通知观察者
  notifyAllObservers() {
    console.log('通知所有观察者');
    this.observer.forEach(observer => {
      observer.notify();
    });
  }
}

// 观察者
class Observer {
  constructor(name) {
    this.name = name;
  }
  notify() {
    console.log(`${this.name} 接收通知`);
  }
}

let sub = new Subject();
let o1 = new Observer('father');
let o2 = new Observer('mother');

sub.attachObserver(o1);
sub.attachObserver(o2);
