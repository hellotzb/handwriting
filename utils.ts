interface AnyObject extends Object {
  [propName: string]: any;
}

// flex布局，最后一行填满item
export const flexFit = (arr, rowNum) => {
  return arr?.length % rowNum === 0
    ? null
    : new Array(rowNum - (arr?.length % rowNum)).fill(0).map((_, index) => {
        // <div className='lottery-item' key={`empty_${index}`}></div>
        return null;
      });
};

interface FormatDateTimeOption extends Intl.DateTimeFormatOptions {
  isSecond: boolean;
  isHour: boolean;
}
export const formatDateTime = (
  date: number = Date.now(),
  option?: Partial<FormatDateTimeOption>
) => {
  const {
    hour12 = false,
    year = 'numeric',
    month = '2-digit',
    day = '2-digit',
    hour = '2-digit',
    minute = '2-digit',
    isSecond = false,
    isHour = false,
  } = option || {};

  // 如果传入非毫秒级时间戳需要进行转换
  let newDate = date;
  if (isSecond) {
    // 单位：秒
    newDate = date * 1000;
  } else if (isHour) {
    // 单位：小时
    newDate = date * 60 * 60 * 1000;
  }

  const formatOptions: Intl.DateTimeFormatOptions = {
    year,
    month,
    day,
    hour,
    minute,
    hour12,
  };
  // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
  const dateTime = new Intl.DateTimeFormat(undefined, formatOptions)
    .format(newDate)
    .split(' ');
  const dateArr = dateTime[0].split('/');
  return {
    date: `${dateArr[0]}年${dateArr[1]}月${dateArr[2]}日`,
    time: dateTime[1],
  };
};

export interface IGroup<T = any> extends AnyObject {
  groups: T[];
}
// 泛型T为需要分组的arr项的类型，默认为AnyObject
type IGrouping1 = <T extends AnyObject>(arr: T[], id: string) => IGroup<T>[];
// 根据id为arr分组
export const grouping1: IGrouping1 = (arr, id) => {
  if (!Array.isArray(arr)) return [];
  const checkList: number[] = []; // 存放唯一id

  return arr.reduce<IGroup[]>((acc, item) => {
    if (!Object.prototype.hasOwnProperty.call(item, id)) return acc;
    if (checkList.includes(item[id])) {
      const idx = checkList.indexOf(item[id]);
      acc[idx].groups.push({ ...item });
    } else {
      const newObj = {
        [id]: item[id],
        groups: [{ ...item }],
      };
      checkList.push(item[id]);
      acc.push(newObj);
    }
    return acc;
  }, []);
};

export interface IGroup<T = any> extends AnyObject {
  groups: T[];
}
// 泛型T为需要分组的arr项的类型，默认为AnyObject
type IGrouping2 = <T extends AnyObject>(arr: T[], ids: string[]) => IGroup<T>[];
// 根据ids为arr分组，ids需要传递一个数组，支持根据多个key进行分组，判断分组key的值需要是基本数据类型！
export const grouping2: IGrouping2 = (arr, ids = []) => {
  if (!Array.isArray(arr)) return [];
  const checkList: string[] = []; // 存放唯一id

  return arr.reduce<IGroup[]>((acc, item) => {
    // 分组对象的唯一id
    const uniqueId = ids.reduce((str, id) => str + item[id], '');
    // 如果数组项不包含id的key则过滤掉该数组项
    const isSkip = !ids.every(id =>
      Object.prototype.hasOwnProperty.call(item, id)
    );
    if (isSkip) return acc;
    if (checkList.includes(uniqueId)) {
      const idx = checkList.indexOf(uniqueId);
      acc[idx].groups.push({ ...item });
    } else {
      const newObj = ids.reduce<IGroup>(
        (obj, id) => {
          obj[id] = item[id];
          return obj;
        },
        { groups: [{ ...item }] }
      );
      checkList.push(uniqueId);
      acc.push(newObj);
    }
    return acc;
  }, []);
};

// 判断当前时间所在小时区间，格式：18:00(24小时制) => 例：传入13:20返回下午1:00-2:00，传入23:20返回下午11：00-上午0：00
export const formatTimeInHour = (time: string) => {
  const compareVal = Number(time.split(':')[0]);
  let period;
  let nextPeriod;
  const nextTime = compareVal + 1;
  if (compareVal < 12) {
    period = '上午';
  } else {
    period = '下午';
  }
  if (nextTime === 12) {
    nextPeriod = '下午';
  } else if (nextTime === 24) {
    nextPeriod = '上午';
  }
  // 23:00-24:00 => 下午11:00 - 上午0:00
  // 11:00-12:00 => 上午11:00 - 下午0:00
  if (nextPeriod) {
    return `${period}${compareVal % 12}:00-${nextPeriod}${nextTime % 12}:00`;
  }
  return `${period}${compareVal % 12}:00-${nextTime % 12}:00`;
};

const appendUrlParam = (url, key, val) => {
  // Bug: 字符匹配问题，appendUrlParam(url, { prop_type: 2, type: 1 })会导致只匹配prop_type且值为1
  if (url.indexOf(key) > -1) {
    return url.replace(new RegExp(`(${key})=([^&]*)`), `$1=${val}`);
  }
  return `${url}${url.indexOf('?') > -1 ? '&' : '?'}${key}=${val}`;
};

export const appendUrlParams = (url, obj) => {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      url = appendUrlParam(url, key, obj[key]);
    }
  }
  return url;
};

// 过滤url参数
export const paramsFilter = (link?: string, deleteParams?: string[]) => {
  if (!link) return;
  const url = new URL(link);
  const param = url.searchParams;
  deleteParams?.forEach(deleteParam => {
    if (param.get(deleteParam)) {
      param.delete(deleteParam);
    }
  });
  return url.href;
};

// url search参数 -> 对象
// let url = "https://www.baidu.com?name=jimmy&age=18&height=1.88"
// queryString 为 window.location.search
const queryString = '?name=jimmy&age=18&height=1.88';
const queryParams = new URLSearchParams(queryString);
// 把键值对列表转换为一个对象。
const paramObj = Object.fromEntries(queryParams);
console.log(paramObj); // { name: 'jimmy', age: '18', height: '1.88' }

/**
 * 
 * @param start 开始时间(时间戳)
 * @param end 结束时间(时间戳)
 * @param callback 回调
 * 执行回调条件:
 * 1. 当前时间大于开始时间 && 没有传入结束时间
 * 2. 当前时间大于开始时间 && 传入了结束时间 && 当前时间小于结束时间
 */
export const execByTime = (start, end, callback) => {
  if (Date.now() >= Number(start)) {
    if (!(end && Date.now() >= Number(end))) {
      callback?.()
    }
  }
}
