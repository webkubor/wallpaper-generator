import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');

/**
 * 返回用于文件名的时间戳，比如 2025-09-05_14-31-48
 */
export function formatFileTimestamp(date?: string | number | Date): string {
  const d = date ? dayjs(date) : dayjs();
  return d.isValid() ? d.format('YYYY-MM-DD_HH-mm-ss') : '';
}

/**
 * 返回用于界面展示的时间字符串，比如 2025-09-05 14:31:48
 * 入参一般为 ISO 字符串（后端/本地存储均用 ISO）
 */
export function formatDisplayTime(iso: string): string {
  const d = dayjs(iso);
  return d.isValid() ? d.format('YYYY-MM-DD HH:mm:ss') : '';
}

/**
 * 直接格式化当前时间
 */
export function formatNow(pattern: string = 'YYYY-MM-DD HH:mm:ss'): string {
  return dayjs().format(pattern);
}

/**
 * 锁屏展示常用：星期, M月D日 + HH:mm
 */
export function getLockScreenNow(): { date: string; time: string } {
  const now = dayjs();
  return {
    date: now.format('dddd, M月D日'),
    time: now.format('HH:mm')
  };
}
