// 总大卡进度条（独立样式，不复用 MacroRow）
// 从 DietTracker.jsx 拆出，纯展示型

export default function KcalRow({ value, target, remainingText }) {
  const pct = target > 0 ? Math.max(0, Math.min(100, Math.round((value / target) * 100))) : 0;
  const over = value > target;
  const remaining = Math.max(0, target - value);
  return (
    <div className={`dt-macro-row dt-macro-row-kcal ${over ? 'is-over' : ''}`}>
      <div className="dt-macro-head">
        <span className="dt-macro-icon" style={{ background: '#FF6F0033', color: '#FF6F00' }}>🔥</span>
        <span className="dt-macro-label">总大卡</span>
        <span className="dt-macro-numbers">
          <b>{value}</b>
          <span className="dt-macro-sep">/</span>
          <span className="dt-macro-target">{target}</span>
          <span className="dt-macro-unit">大卡</span>
        </span>
      </div>
      <div className="dt-progress">
        <div
          className="dt-progress-fill"
          style={{ width: `${pct}%`, background: over ? 'var(--color-danger)' : '#FF6F00' }}
        />
      </div>
      <div className="dt-macro-foot">
        {over ? (
          <span className="dt-macro-over">已超标 {value - target} 大卡</span>
        ) : (
          <span className="dt-macro-remaining">
            还差 <b>{remaining}</b> 大卡
            {remainingText && (
              <em className="dt-macro-desc">
                ≈ <b className="dt-desc-qty">{remainingText}</b>
              </em>
            )}
          </span>
        )}
        <span className="dt-macro-pct">{pct}%</span>
      </div>
    </div>
  );
}
