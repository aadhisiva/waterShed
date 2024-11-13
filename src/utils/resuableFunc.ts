let timeoutId: string | number | NodeJS.Timeout | undefined;

export function debounce(cb: any, delay: any) {
  return (...args: any) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      cb(...args);
    }, delay);
  };
}