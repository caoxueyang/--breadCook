import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { App } from '@capacitor/app';

// 主 tab 路径（有底部导航的页面），左滑到这些页面时弹退出确认
const MAIN_PATHS = ['/favs', '/dishes', '/drinks', '/desserts'];

/**
 * 监听 Android 系统返回键 / 滑手势：
 * - 子页面 → 返回上一页
 * - 主页面 → 调用 onRequestExit（通常弹退出确认）
 * - 仅在 Android 原生环境启用，浏览器调试时跳过
 *
 * @param {() => void} onRequestExit  在主 tab 页点击返回时触发
 */
export function useBackButton(onRequestExit) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 仅在 Capacitor 原生环境启用
    const isNative = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
    if (!isNative) return;

    let listenerHandle = null;
    const handle = async () => {
      const path = location.pathname;
      // 已在主 tab 页：请求退出
      if (MAIN_PATHS.includes(path)) {
        if (typeof onRequestExit === 'function') onRequestExit();
        return;
      }
      // 子页面：返回上一页
      navigate(-1);
    };

    // 注册 Capacitor App 返回事件
    try {
      App.addListener('backButton', handle).then(h => { listenerHandle = h; }).catch(() => {});
    } catch (_) {}

    // 兜底：传统 document backbutton 事件
    const onBack = (e) => { e.preventDefault && e.preventDefault(); handle(); };
    document.addEventListener('backbutton', onBack, false);

    return () => {
      if (listenerHandle && listenerHandle.remove) listenerHandle.remove();
      document.removeEventListener('backbutton', onBack, false);
    };
  }, [navigate, location.pathname, onRequestExit]);
}