import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import TagFilter from '../components/TagFilter';
import DishCard from '../components/DishCard';
import {
  getCurrentMonth,
  getSeasonalData,
  getSeasonalDishIngredients,
  getSeasonalFruitIngredients,
  dishMatchesSeasonal,
} from '../utils/seasonal';
import {
  getPesticideRisk,
  RISK_LABELS,
  RISK_COLORS,
} from '../data/pesticideRisk';
import './Page.css';

const CATEGORY_MAP = {
  dishes: { title: '菜品', emoji: '🍳', empty: '🥘' },
  drinks: { title: '酒品', emoji: '🍹', empty: '🥂' },
  desserts: { title: '甜品', emoji: '🍰', empty: '🧁' },
};

export default function Category() {
  const { category } = useParams();
  const { dishes } = useData();
  const [activeTag, setActiveTag] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const config = CATEGORY_MAP[category] || { title: '未知', emoji: '❓', empty: '🍽️' };

  const filteredDishes = useMemo(() => {
    let result = dishes.filter(d => d.category === category);
    if (activeTag === '应季菜') {
      const ingredients = getSeasonalDishIngredients();
      result = result.filter(d => dishMatchesSeasonal(d, ingredients));
    } else if (activeTag === '应季水果') {
      const ingredients = getSeasonalFruitIngredients();
      result = result.filter(d => dishMatchesSeasonal(d, ingredients));
    } else if (activeTag) {
      result = result.filter(d => d.tags && d.tags.includes(activeTag));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(d => {
        // 菜名匹配
        if (d.name.toLowerCase().includes(q)) return true;
        // 食材匹配：提取“材料”部分
        const m = (d.recipe || '').match(/材料[::]([\s\S]*?)(?:\n\n|$)/);
        if (m && m[1] && m[1].toLowerCase().includes(q)) return true;
        return false;
      });
    }
    result.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    return result;
  }, [dishes, category, activeTag, searchQuery]);

  return (
    <div className="page">
      <header className="page-header safe-area-top">
        <div className="header-top">
          <div>
            <h1 className="header-title">{config.emoji} {config.title}</h1>
            <p className="header-subtitle">共 {filteredDishes.length} 道</p>
          </div>
        </div>
        <TagFilter activeTag={activeTag} onTagChange={setActiveTag} category={category} />
        <div className="search-bar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="搜索菜品或食材"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => setSearchQuery('')}>✕</button>
          )}
        </div>
      </header>

      <div className="page-content">
        {activeTag === '应季菜' || activeTag === '应季水果' ? (
          <SeasonalBanner type={activeTag} count={filteredDishes.length} />
        ) : null}
        {filteredDishes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">{config.empty}</div>
            <p className="empty-text">
              {activeTag === '应季菜' || activeTag === '应季水果'
                ? `${getSeasonalData().months.join('、')} 月应季食材中还没有匹配的菜品`
                : `暂无${config.title}`}
            </p>
            <p className="empty-hint">点击下方 + 添加新菜品</p>
          </div>
        ) : (
          <div className="dish-grid">
            {filteredDishes.map(dish => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        )}
      </div>

      <button
        className="fab"
        onClick={() => navigate(`/edit/new?category=${category}`)}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>
    </div>
  );
}

/**
 * 本月应季食材 Banner（按月分块展示 5/6/7 三个月）
 * 应季菜：蔬野菜 + 威海应季海鲜
 * 应季水果：威海本地应季水果 + 其他产区应季水果
 */
function SeasonalBanner({ type, count }) {
  const data = getSeasonalData();
  const isDish = type === '应季菜';
  const icon = isDish ? '🌱' : '🍓';
  const rangeText = `${data.months[0]}–${data.months[2]} 月`;
  const title = isDish
    ? `${rangeText}威海应季菜`
    : `${rangeText}应季水果`;

  return (
    <div className="seasonal-banner">
      <div className="seasonal-banner-header">
        <span className="seasonal-icon">{icon}</span>
        <span className="seasonal-title">{title}</span>
        <span className="seasonal-count">匹配 {count} 道菜</span>
      </div>
      <div className="seasonal-months">
        {data.byMonth.map(monthData => (
          <SeasonalMonthBlock
            key={monthData.month}
            monthData={monthData}
            isDish={isDish}
          />
        ))}
      </div>
    </div>
  );
}

/** 单个月份的食材块：蔬野菜+海鲜 或 本地水果+其他产区水果 */
function SeasonalMonthBlock({ monthData, isDish }) {
  const { month, veggies, seafood, fruitsLocal, fruitsOther } = monthData;
  const hasAny =
    veggies.length + seafood.length + fruitsLocal.length + fruitsOther.length > 0;
  if (!hasAny) return null;

  return (
    <div className="seasonal-month-block">
      <div className="seasonal-month-title">{month} 月</div>
      {isDish ? (
        <>
          {veggies.length > 0 && (
            <div className="seasonal-section">
              <div className="seasonal-section-title">🥬 蔬野菜</div>
              <div className="seasonal-tags">
                {veggies.map(name => (
                  <SeasonalTagWithRisk key={name} name={name} />
                ))}
              </div>
            </div>
          )}
          {seafood.length > 0 && (
            <div className="seasonal-section">
              <div className="seasonal-section-title">🦐 威海应季海鲜</div>
              <div className="seasonal-tags">
                {seafood.map(name => (
                  <span key={name} className="seasonal-tag">{name}</span>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {fruitsLocal.length > 0 && (
            <div className="seasonal-section">
              <div className="seasonal-section-title">🍓 威海本地应季水果</div>
              <div className="seasonal-tags">
                {fruitsLocal.map(name => (
                  <SeasonalTagWithRisk key={name} name={name} />
                ))}
              </div>
            </div>
          )}
          {fruitsOther.length > 0 && (
            <div className="seasonal-section">
              <div className="seasonal-section-title">🌏 其他产区应季水果</div>
              <div className="seasonal-tags">
                {fruitsOther.map(f => (
                  <SeasonalTagWithRisk
                    key={f.name}
                    name={f.name}
                    origin={f.origin}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/** 单个应季食材标签 + 农残风险指示器 */
function SeasonalTagWithRisk({ name, origin }) {
  const risk = getPesticideRisk(name);
  const colors = risk ? RISK_COLORS[risk] : null;
  const label = risk ? RISK_LABELS[risk] : null;

  return (
    <span
      className={`seasonal-tag ${risk ? 'has-risk' : ''}${origin ? ' seasonal-tag-fruit' : ''}`}
      style={risk ? {
        '--risk-bg': colors.bg,
        '--risk-border': colors.border,
        '--risk-text': colors.text,
      } : undefined}
      title={label ? `${label.desc}` : undefined}
    >
      {origin ? (
        <>
          <span className="seasonal-tag-name">{name}</span>
          <span className="seasonal-tag-origin">· {origin}</span>
        </>
      ) : (
        name
      )}
      {risk && (
        <span
          className="risk-dot"
          style={{ backgroundColor: colors.text }}
        />
      )}
    </span>
  );
}
