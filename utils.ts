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
type IGrouping = <T extends AnyObject>(arr: T[], id: string) => IGroup<T>[];
// 根据id为arr分组
export const grouping: IGrouping = (arr, id) => {
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
