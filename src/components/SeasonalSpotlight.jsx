// 应季菜推荐：顶部 Spotlight 组件
// 显示当前月份、应季食材小标签、按命中数排序的应季菜
// 点击菜品 → 跳转到详情页
import { useNavigate } from 'react-router-dom';
import { findSeasonalDishes, getSeasonalData } from '../utils/seasonal';
import './SeasonalSpotlight.css';

const MONTH_NAMES = [
  '1 月', '2 月', '3 月', '4 月', '5 月', '6 月',
  '7 月', '8 月', '9 月', '10 月', '11 月', '12 月',
];

// 12 个月份 → emoji 季节感
const MONTH_EMOJI = [
  '❄️', '❄️', '🌱', '🌱', '🌿', '☀️',
  '☀️', '☀️', '🍂', '🍂', '🍁', '❄️',
];

export default function SeasonalSpotlight({ dishes }) {
  const navigate = useNavigate();
  const month = new Date().getMonth() + 1;
  const data = getSeasonalData(month);
  // 应季食材小标签：合并 3 个月窗口的 veggies + seafood 去重，取前 8 个
  const ingredientLabels = [];
  const seenLabel = new Set();
  for (const { veggies, seafood } of data.byMonth) {
    for (const arr of [veggies, seafood]) {
      for (const name of arr) {
        if (name && !seenLabel.has(name)) {
          seenLabel.add(name);
          ingredientLabels.push(name);
          if (ingredientLabels.length >= 8) break;
        }
      }
      if (ingredientLabels.length >= 8) break;
    }
    if (ingredientLabels.length >= 8) break;
  }
  const matches = findSeasonalDishes(dishes, month, 6);

  if (matches.length === 0) return null;

  return (
    <div className="seasonal-spotlight">
      <div className="seasonal-spotlight-header">
        <div className="seasonal-spotlight-title">
          <span className="seasonal-spotlight-emoji">{MONTH_EMOJI[month - 1]}</span>
          <div>
            <div className="seasonal-spotlight-month">{MONTH_NAMES[month - 1]} 应季</div>
            <div className="seasonal-spotlight-sub">当下最新鲜，吃的就是个「时令」</div>
          </div>
        </div>
      </div>
      <div className="seasonal-spotlight-tags">
        {ingredientLabels.map((name) => (
          <span key={name} className="seasonal-spotlight-tag">{name}</span>
        ))}
      </div>
      <div className="seasonal-spotlight-dishes">
        {matches.map(({ dish, matched }) => (
          <button
            key={dish.id}
            type="button"
            className="seasonal-spotlight-card"
            onClick={() => navigate(`/dish/${dish.id}`)}
            title={dish.name}
          >
            <div className="seasonal-spotlight-card-name">{dish.name}</div>
            <div className="seasonal-spotlight-card-meta">
              命中 {matched.length} 样应季食材
            </div>
            <div className="seasonal-spotlight-card-tags">
              {matched.slice(0, 2).map((m) => (
                <span key={m} className="seasonal-spotlight-card-tag">{m}</span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
