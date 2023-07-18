/**
 * setup
 * 有搜索条件,分页的异步请求
 */
import { computed, watch, ref, unref, type Ref, type ComputedRef } from 'vue';

interface IAsyncDataWithPaginationOptions {
  request: <T>(params?: Record<string | number | symbol, any>) => Promise<T>;
  filterData?: Ref | ComputedRef;
  listKey?: string;
  defaultPaginationOpts?: { pageSize?: number; pageNum?: number };
  reqPaginationKeys?: { currentKey: string; pageSizeKey: string };
  resPaginationKeys?: { currentKey?: string; pageSizeKey?: string; totalKey?: string };
  handleData?: (params?: Record<string | number | symbol, any>) => void;
  callback?: (params?: Record<string | number | symbol, any>) => void;
}

export default function useAsyncDataWithPagination({
  // 异步请求
  request,
  //搜索条件
  filterData = ref({}),
  // 返回列表键值
  listKey = 'content',
  // 默认分页
  defaultPaginationOpts = { pageSize: 10, pageNum: 1 },
  // 分页参数键值
  reqPaginationKeys = {
    currentKey: 'pageNum',
    pageSizeKey: 'pageSize',
  },
  // 分页结果键值
  resPaginationKeys = {
    currentKey: 'pageNum',
    pageSizeKey: 'pageSize',
    totalKey: 'totalSize',
  },
  // 用于处理返回的list
  handleData,
  // 请求调用成功结束后调用
  callback,
}: IAsyncDataWithPaginationOptions) {
  const [list, loading, current, pageSize, total] = [
    ref([]),
    ref(false),
    ref(defaultPaginationOpts?.pageNum || 1),
    ref(defaultPaginationOpts?.pageSize || 10),
    ref(0),
  ];

  const getData = async (params: { pageSize?: number; current?: number } = {}) => {
    try {
      loading.value = true;
      const res = await unref(request)({
        [reqPaginationKeys.pageSizeKey]: params.pageSize ?? pageSize.value,
        [reqPaginationKeys.currentKey]: params.current ?? current.value,
        ...filterData.value,
      });
      const resV: any = res || {};
      current.value = resV[resPaginationKeys?.currentKey || 'pageNum'] || 0;
      pageSize.value = resV[resPaginationKeys?.pageSizeKey || 'pageSize'] || 0;
      total.value = resV[resPaginationKeys?.totalKey || 'totalSize'] || 0;
      let _list = Array.isArray(resV[listKey]) ? resV[listKey] : [];
      if (handleData && typeof unref(handleData) === 'function') {
        _list = await unref(handleData)(_list);
      }
      list.value = _list;
      if (callback && typeof callback === 'function') {
        callback();
      }
    } catch {
      list.value = [];
    } finally {
      loading.value = false;
    }
  };

  // 搜索条件变化
  const updateHandler = computed(() => ({ filterData, request }));
  watch(updateHandler, () => getData({ current: 1 }), { immediate: true, deep: true });

  // 表格更新
  const handleChange = (options: { currentPage?: number; pageSize?: number } = {}) => {
    getData({ current: options.currentPage, pageSize: options.pageSize });
  };
  // 返回页
  const pagination = computed(() => ({ total: total.value, currentPage: current.value, pageSize: pageSize.value }));

  return {
    pagination,
    list,
    loading,
    handleChange,
    getData,
    pageSize,
  };
}
