import { ref, unref, watch, type ComputedRef, type Ref } from 'vue';

interface IAsyncData {
  request: <T>(params?: Record<string | number | symbol, any>) => Promise<T>;
  filterData?: Ref | ComputedRef;
  verifyFun?: (params?: Record<string | number | symbol, any>) => Promise<boolean | undefined | null>;
  manual?: boolean;
  callback?: (params?: Record<string | number | symbol, any>) => void;
}

/**
 * 有搜索条件的异步请求
 * @param {*} request 异步请求
 * @param {*} filterData 搜索条件
 * @param {*} verifyFun 校验函数，在执行接口前调用，返回false停止调用接口，需同步执行
 * @param {*} manual 手动触发请求
 * @param {*} callback 请求调用成功结束后调用
 * @returns
 */
export default function useAsyncData({
  request,
  filterData = ref({}),
  verifyFun,
  manual = false,
  callback,
}: IAsyncData) {
  const loading = ref(false);
  const data = ref();

  const getData = async () => {
    try {
      loading.value = true;
      if (verifyFun && typeof verifyFun === 'function') {
        const verify = await verifyFun();
        if (!verify) return;
      }
      const res = await unref(request)(filterData.value);
      data.value = res;
      if (callback && typeof callback === 'function') {
        callback();
      }
    } catch {
      data.value = undefined;
    } finally {
      loading.value = false;
    }
  };
  // 搜索条件变化
  if (!manual) {
    watch(
      () => filterData,
      () => getData(),
      { immediate: true, deep: true },
    );
  }

  // 返回列表
  return { getData, data, loading };
}
