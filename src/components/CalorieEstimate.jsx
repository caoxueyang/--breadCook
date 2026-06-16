import { useMemo } from 'react';
import { estimateCalories } from '../utils/calorieDB';
import './CalorieEstimate.css';

export default function CalorieEstimate({ recipe, dishName }) {
  const result = useMemo(() => estimateCalories(recipe), [recipe]);

  if (!result.hasData) return null;

  return (
    <div className="calorie-section">
      <div className="calorie-header">
        <span className="calorie-title">🥗 热量小估算</span>
        <span className="calorie-total">{result.displayTotal}</span>
      </div>

      {result.riceBowls > 0 && (
        <p className="calorie-rice-ref">
          相当于 <strong>{result.riceBowls} 碗米饭</strong> 🍚
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
