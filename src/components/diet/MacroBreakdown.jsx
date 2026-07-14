// 宏量营养素来源分析（碳水/蛋白/脂肪的构成明细 + 隐藏碳水告警）
// 从 DietTracker.jsx 拆出，纯展示型组件

import { useMemo } from 'react';
import { describeFoods } from '../../utils/foodDatabase';

// 三大营养素配置（用于宏量素来源展示）
const MACROS = [
  { name: 'carbs',   label: '碳水', icon: '🍚' },
  { name: 'protein', label: '蛋白', icon: '🥩' },
  { name: 'fat',     label: '脂肪', icon: '🥑' },
];

export default function MacroBreakdown({ foodList }) {
  const report = useMemo(() => describeFoods(foodList), [foodList]);
  if (!report.carbs.text && !report.protein.text && !report.fat.text) return null;
  const hasHidden = report.carbs.hiddenGrams >= 15;
  return (
    <div className={`dt-carbs-breakdown ${hasHidden ? 'has-hidden' : ''}`}>
      <div className="dt-carbs-breakdown-title">
        🥖 营养素来源
        {hasHidden && <span className="dt-carbs-hidden-badge">⚠️ 隐藏 {report.carbs.hiddenGrams}g 碳水</span>}
      </div>
      {MACROS.map((m) => {
        const r = report[m.name];
        if (!r || !r.text) return null;
        return (
          <div key={m.name} className="dt-carbs-breakdown-line">
            <span className="dt-carbs-breakdown-line-label">{m.icon} {m.label}</span>
            <span className="dt-carbs-breakdown-line-text">≈ {r.text}</span>
            <span className="dt-carbs-breakdown-total">（{r.totalGrams}g）</span>
          </div>
        );
      })}
      {hasHidden && report.carbs.hiddenItems.length > 0 && (
        <div className="dt-carbs-hidden-tip">
          💡 隐藏碳水（容易被忽略的）：<br />
          {report.carbs.hiddenItems.map((it, i) => (
            <span key={i} className="dt-carbs-hidden-item">
              {it.qty}{it.unit}{it.name} = {it.grams}g
              {i < report.carbs.hiddenItems.length - 1 ? ' · ' : ''}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
