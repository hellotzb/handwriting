// https://www.izhaoo.com/2021/08/03/intersection-observer/

// var observer = new IntersectionObserver(callback[, options]);

/** entries:
 * isIntersecting: 目标元素进入可视区域或离开可见区域
 * intersectionRatio: 目标元素在可视区域的比例
 * intersectionRect: 目标元素与根元素的相交区域
 * boundingClientRect: 目标元素的边界区域，同 getBoundingClientRect()
 * rootBounds: 返回交叉区域观察者中的根
 * target: 触发时的目标元素
 * time: 触发时的时间戳
 */

/** options:
 * root: 监听对象的父元素，未指定则默认为根元素（root）
 * rootMargin: 计算时的边界偏移量，可以放大/缩小计算容器.默认值是"0px 0px 0px 0px"
 * threshold: 监听对象与父元素交叉比例触发阈值（0~1）.阈值的默认值为0.0。
 */

/** 方法：
 * observer.disconnect(): 使IntersectionObserver对象停止监听工作
 * observer.observe(): 使IntersectionObserver开始监听一个目标元素
 * observer.takeRecords(): 返回所有观察目标的IntersectionObserverEntry对象数组
 * observer.unobserve(): 使IntersectionObserver停止监听特定目标元素
 */
