// 全局「已删除 · 撤销」浮层
// 订阅 DataContext.lastDeletedBackup，显示 5 秒倒计时 + 撤销按钮
// 点撤销 → 恢复菜品；点关闭 / 倒计时归零 → 清除 backup
import { useEffect, useState } from 'react';
import { useData } from '../contexts/DataContext';
import './UndoDeleteToast.css';

export default function UndoDeleteToast() {
  const { lastDeletedBackup, restoreLastDeleted, dismissDeletedBackup } = useData();
  const [secondsLeft, setSecondsLeft] = useState(5);

  useEffect(() => {
    if (!lastDeletedBackup) {
      setSecondsLeft(5);
      return undefined;
    }
    // 倒计时 5 → 0
    setSecondsLeft(5);
    const startedAt = Date.now();
    const total = 5000;
    const id = window.setInterval(() => {
      const remain = Math.max(0, Math.ceil((total - (Date.now() - startedAt)) / 1000));
      setSecondsLeft(remain);
      if (remain <= 0) window.clearInterval(id);
    }, 250);
    return () => window.clearInterval(id);
  }, [lastDeletedBackup]);

  if (!lastDeletedBackup) return null;

  const name = lastDeletedBackup.dish?.name || '菜品';

  return (
    <div className="undo-delete-toast" role="status" aria-live="polite">
      <div className="undo-delete-icon" aria-hidden="true">🗑️</div>
      <div className="undo-delete-body">
        <div className="undo-delete-title">
          已删除 <strong>{name}</strong>
        </div>
        <div className="undo-delete-hint">
          {secondsLeft > 0 ? `${secondsLeft} 秒后可撤销` : '即将永久删除'}
        </div>
      </div>
      <button
        type="button"
        className="undo-delete-action"
        onClick={restoreLastDeleted}
        disabled={secondsLeft <= 0}
      >
        撤销
      </button>
      <button
        type="button"
        className="undo-delete-close"
        onClick={dismissDeletedBackup}
        aria-label="关闭"
        title="关闭"
      >
        ✕
      </button>
    </div>
  );
}
