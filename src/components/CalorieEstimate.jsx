import { useMemo } from 'react';
import { estimateCalories } from '../utils/calorieDB';
import './CalorieEstimate.css';

export default function CalorieEstimate({ recipe, servings, dishName }) {
  // servings > 1 时拆解为每人份重点展示
  const result = useMemo(
    () => estimateCalories(recipe, servings || 1),
    [recipe, servings]
  );

  if (!result.hasData) return null;

  // servings 未传或=1 → 只显示总量（保持老设计）
  // servings > 1 → 突出“每份”，总量/份数作为补充说明
  const showPerServing = result.servings > 1;

  return (
    <div className="calorie-section">
      <div className="calorie-header">
        <span className="calorie-title">🥗 热量小估算</span>
        {showPerServing ? (
          <span className="calorie-per-serving-main">
            <span className="calorie-per-serving-label">每份</span>
            <strong>{result.perServing}</strong>
            <span className="calorie-unit">卡</span>
          </span>
        ) : (
          <span className="calorie-total">{result.displayTotal}</span>
        )}
      </div>

      {/* 份数 / 总量的补充说明 */}
      {showPerServing && (
        <p className="calorie-servings-info">
          整道菜约 <b>{result.total}</b> 卡 · 默认 <b>{result.servings}</b> 份
        </p>
      )}

      {result.riceBowls > 0 && (
        <p className="calorie-rice-ref">
          {showPerServing ? '每份' : '这道菜'}相当于 <strong>{result.riceBowls} 碗米饭</strong> 🍚
          {result.riceBowls >= 8 && ' ～ 吃完记得多走走哦！'}
          {result.riceBowls >= 5 && result.riceBowls < 8 && ' ～ 今天运动量要跟上 💪'}
          {result.riceBowls >= 3 && result.riceBowls < 5 && ' ～ 适量吃完全没问题 👍'}
          {result.riceBowls < 3 && result.riceBowls > 0 && ' ～ 很清爽的一道菜 ✨'}
        </p>
      )}

      {result.items.length > 0 && (
        <div className="calorie-detail">
          <p className="calorie-detail-title">📋 主要食材明细：</p>
          <div className="calorie-items">
            {result.items.map((item, i) => (
              <div key={i} className="calorie-item">
                <span className="calorie-item-emoji">{item.emoji}</span>
                <span className="calorie-item-name">
                  {item.name}
                  {item.amount && item.unit ? ` ${item.amount}${item.unit}` : ''}
                </span>
                <span className="calorie-item-cal">{item.calories} 卡</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
