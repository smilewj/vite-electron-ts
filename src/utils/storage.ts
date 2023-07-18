export default {
  /**
   * 带过期时间的 localStorage 存储
   * @param key
   * @param value
   * @param expire
   */
  setLocal<T>(key: string, value: T, expire: number = Infinity) {
    const jsonStr = JSON.stringify({
      data: value,
      time: new Date().getTime(),
      expire: isFinite(expire) ? expire : 'Infinity',
    });
    // window.localStorage.setItem(key, window.btoa(encodeURIComponent(jsonStr)));
    window.localStorage.setItem(key, jsonStr);
  },
  /**
   * 获取带过期时间的 localStorage 存储
   * @param key
   */
  getLocal<T>(key: string) {
    const val = window.localStorage.getItem(key);
    if (!val) return undefined;
    try {
      // const obj = JSON.parse(decodeURIComponent(window.atob(val)));
      const obj = JSON.parse(val);
      const { data, time, expire } = obj;
      if (!time) {
        throw new Error(`${key}：存储时间获取失败！`);
      }
      const currentTimeStamp = new Date().getTime();
      if (!expire || currentTimeStamp - time > Number(expire) * 24 * 60 * 60 * 1000) {
        throw new Error(`${key}：已过期！`);
      }
      return data as T;
    } catch (e) {
      console.error(e);
      window.localStorage.removeItem(key);
      return undefined;
    }
  },
};
