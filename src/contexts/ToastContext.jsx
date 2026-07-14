// 全局 Toast 队列管理
// 用法：
//   const toast = useToast();
//   toast.success('保存成功');
//   toast.error('网络异常');
//   toast.info('3 秒后跳转', 3000);
//   toast.custom({ icon: '🗑', message: '已删除', action: { label: '撤销', onClick: fn } });
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import './Toast.css';

const ToastContext = createContext(null);

let nextId = 1;
const genId = () => `t_${Date.now().toString(36)}_${nextId++}`;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  const remove = useCallback((id) => {
    setToasts((cur) => cur.filter((t) => t.id !== id));
    const tm = timersRef.current.get(id);
    if (tm) {
      window.clearTimeout(tm);
      timersRef.current.delete(id);
    }
  }, []);

  const push = useCallback((toast) => {
    const id = genId();
    const duration = toast.duration ?? 2400;
    const record = { id, type: 'info', duration, ...toast };
    setToasts((cur) => [...cur, record]);
    if (duration > 0) {
      const tm = window.setTimeout(() => remove(id), duration);
      timersRef.current.set(id, tm);
    }
    return id;
  }, [remove]);

  const api = {
    success: (message, opts) => push({ type: 'success', message, ...opts }),
    error:   (message, opts) => push({ type: 'error', message, duration: 3500, ...opts }),
    info:    (message, opts) => push({ type: 'info', message, ...opts }),
    warn:    (message, opts) => push({ type: 'warn', message, duration: 3000, ...opts }),
    custom:  (opts) => push({ type: 'custom', ...opts }),
    remove,
    clear:   () => { setToasts([]); timersRef.current.forEach((t) => window.clearTimeout(t)); timersRef.current.clear(); },
  };

  // 卸载时清空所有 timer
  useEffect(() => () => {
    timersRef.current.forEach((t) => window.clearTimeout(t));
    timersRef.current.clear();
  }, []);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <ToastHost toasts={toasts} remove={remove} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // 在 Provider 之外使用时不抛错，退化为 no-op
    return {
      success: () => {},
      error:   () => {},
      info:    () => {},
      warn:    () => {},
      custom:  () => {},
      remove:  () => {},
      clear:   () => {},
    };
  }
  return ctx;
}

// === 渲染层 ===
function ToastHost({ toasts, remove }) {
  if (!toasts || toasts.length === 0) return null;
  return (
    <div className="toast-host" aria-live="polite" aria-atomic="false">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onClose={() => remove(t.id)} />
      ))}
    </div>
  );
}

const ICON_MAP = {
  success: '✅',
  error:   '❌',
  warn:    '⚠️',
  info:    '💡',
  custom:  '🔔',
};

function ToastItem({ toast, onClose }) {
  const icon = toast.icon || ICON_MAP[toast.type] || '💡';
  return (
    <div className={`toast-item toast-${toast.type}`} role="status">
      <span className="toast-icon" aria-hidden="true">{icon}</span>
      <span className="toast-message">{toast.message}</span>
      {toast.action && (
        <button
          type="button"
          className="toast-action"
          onClick={() => {
            try { toast.action.onClick && toast.action.onClick(); } finally { onClose(); }
          }}
        >
          {toast.action.label || '操作'}
        </button>
      )}
      <button
        type="button"
        className="toast-close"
        onClick={onClose}
        aria-label="关闭通知"
        title="关闭"
      >
        ✕
      </button>
    </div>
  );
}
