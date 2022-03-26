// 带查询的分页加载长列表

/**
 *
 * @param {*} defaultQuery  表格的默认参数，有些业务表格，除了查询和分页之外，有一些独立的请求参数
 * @param {*} api           api 为请求数据方法，内部用 Promise 封装处理
 */
const useQueryTable = (defaultQuery = {}, api) => {
  /* 保存查询表格表单信息 */
  const formData = React.useRef({});
  /* 保存查询表格分页信息 */
  const pagination = React.useRef({
    page: defaultQuery.page || 1,
    pageSize: defaultQuery.pageSize || 10,
  });

  /* 强制更新 */
  const [, forceUpdate] = React.useState(null);

  /* 请求表格数据 */
  const [tableData, setTableData] = React.useState({
    data: [],
    total: 0,
    current: 1,
  });

  /* 请求列表数据 */
  const getList = React.useCallback(
    async function (payload = {}) {
      if (!api) return;
      const data =
        (await api({
          ...defaultQuery,
          ...payload,
          ...pagination.current,
          ...formData.current,
        })) || {};
      if (data.code == 200) {
        setTableData({
          list: data.list,
          current: data.current,
          total: data.total,
        });
      } else {
      }
    },
    [api]
  ); /* 以api作为依赖项，当api改变，重新声明getList */

  /* 改变表单单元项 */
  const setFormItem = React.useCallback(function (key, value) {
    const form = formData.current;
    form[key] = value;
    forceUpdate({}); /* forceUpdate 每一次都能更新，不会造成 state 相等的情况 */
  }, []);

  /* 重置表单 */
  const reset = React.useCallback(
    function () {
      const current = formData.current;
      for (let name in current) {
        current[name] = '';
      }
      pagination.current.page = defaultQuery.page || 1;
      pagination.current.pageSize = defaultQuery.pageSize || 10;
      /* 请求数据  */
      getList();
    },
    [getList]
  ); /* getList 作为 reset 的依赖项  */

  /* 处理分页逻辑 */
  const handerChange = React.useCallback(
    async function (page, pageSize) {
      pagination.current = {
        page,
        pageSize,
      };
      getList();
    },
    [getList]
  ); /* getList 作为 handerChange 的依赖项  */

  /* 初始化请求数据 */
  React.useEffect(() => {
    getList();
  }, []);

  /* 组合暴露参数 */
  return [
    {
      /* 组合表格状态 */ tableData,
      handerChange,
      getList,
      pagination: pagination.current,
    },
    {
      /* 组合搜索表单状态 */ formData: formData.current,
      setFormItem,
      reset,
    },
  ];
};

/* 模拟数据请求 */
function getTableData(payload) {
  return new Promise(resolve => {
    Promise.resolve().then(() => {
      const { list } = listData;
      const arr = threeNumberRandom(); // 生成三个随机数 模拟数据交互
      console.log('请求参数：', payload);
      resolve({
        ...listData,
        list: [list[arr[0]], list[arr[1]], list[arr[2]]],
        total: list.length,
        current: payload.page || 1,
      });
    });
  });
}
const Index = () => {
  const [table, form] = useQueryTable({ pageSize: 3 }, getTableData);
  const { formData, setFormItem, reset } = form;
  const { pagination, tableData, getList, handerChange } = table;
  return (
    <div style={{ margin: '30px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Input
          onChange={e => setFormItem('name', e.target.value)}
          placeholder='请输入名称'
          style={inputStyle}
          value={formData.name || ''}
        />
        <Input
          onChange={e => setFormItem('price', e.target.value)}
          placeholder='请输入价格'
          style={inputStyle}
          value={formData.price || ''}
        />
        <Select
          onChange={value => setFormItem('type', value)}
          placeholder='请选择'
          style={inputStyle}
          value={formData.type}
        >
          <Option value='1'>家电</Option>
          <Option value='2'>生活用品</Option>
        </Select>
        <button className='searchbtn' onClick={() => getList()}>
          提交
        </button>
        <button className='concellbtn' onClick={reset}>
          重置
        </button>
      </div>
      {useCallback(
        <Table
          columns={columns}
          dataSource={tableData.list}
          height='300px'
          onChange={res => {
            handerChange(res.current, res.pageSize);
          }}
          pagination={{
            ...pagination,
            total: tableData.total,
            current: tableData.current,
          }}
          rowKey='id'
        />,
        [tableData]
      )}
    </div>
  );
};
