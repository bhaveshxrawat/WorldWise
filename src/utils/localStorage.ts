function getItemLS<T>(key: string, initialValue: T) {
  try {
    const res = localStorage.getItem(key);
    if (res === null) {
      setItemLS(key, initialValue);
      return initialValue;
    }
    return JSON.parse(res) as T;
  } catch (err) {
    console.error(err);
    return initialValue;
  }
}
function setItemLS<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

export { getItemLS, setItemLS };
