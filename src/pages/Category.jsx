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
  searchPesticideRisks,
  getOriginRecommendations,
  RISK_LABELS,
  RISK_COLORS,
} from '../data/pesticideRisk';
import './Page.css';

/**
 * 食材名称异体字/形近字归一化
 * 解决「西兰花」vs「西蓝花」等写法差异导致的搜不到问题
 */
function normalizeName(str) {
  return str
    .toLowerCase()
    .replace(/蓝/g, '兰');
}

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
  const [selectedMonth, setSelectedMonth] = useState(() => getCurrentMonth());
  const navigate = useNavigate();

  const config = CATEGORY_MAP[category] || { title: '未知', emoji: '❓', empty: '🍽️' };

  const filteredDishes = useMemo(() => {
    let result = dishes.filter(d => d.category === category);
    // P3-A：搜索框有内容时，绕开 activeTag 过滤 —— 搜的就是全库
    // 应季/标签过滤只在「浏览模式」生效，搜索时一律搜全库
    const isSearching = searchQuery.trim().length > 0;
    if (!isSearching) {
      if (activeTag === '应季菜') {
        const ingredients = getSeasonalDishIngredients(selectedMonth);
        result = result.filter(d => dishMatchesSeasonal(d, ingredients));
      } else if (activeTag === '应季水果') {
        const ingredients = getSeasonalFruitIngredients(selectedMonth);
        result = result.filter(d => dishMatchesSeasonal(d, ingredients));
      } else if (activeTag) {
        result = result.filter(d => d.tags && d.tags.includes(activeTag));
      }
    }
    if (isSearching) {
      const q = searchQuery.trim().toLowerCase();
      // 分两组：菜名匹配优先，食材匹配次之
      const nameMatched = [];
      const ingredientMatched = [];

      const nq = normalizeName(q);
      result.forEach(d => {
        // 菜名精确匹配（异体字归一化后比较）
        if (normalizeName(d.name).includes(nq)) {
          nameMatched.push(d);
          return;
        }
        // 食材精确匹配：提取"材料"部分
        const m = (d.recipe || '').match(/材料[：:]([\s\S]*?)(?:\n\n|$)/);
        if (m && m[1] && normalizeName(m[1]).includes(nq)) {
          ingredientMatched.push(d);
        }
      });

      // 组内按更新时间排序
      const sortByTime = (a, b) => (b.updatedAt || 0) - (a.updatedAt || 0);
      nameMatched.sort(sortByTime);
      ingredientMatched.sort(sortByTime);
      result = [...nameMatched, ...ingredientMatched];
    } else {
      result.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    }
    return result;
  }, [dishes, category, activeTag, searchQuery]);

  // 搜索模式下，检测搜索词是否匹配已知食材，提取农残信息（可能匹配多个）
  const searchedIngredients = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return [];
    return searchPesticideRisks(q);
  }, [searchQuery]);

  return (
    <div className="page">
      <header className="page-header safe-area-top">
        <div className="header-top">
          <div>
            <h1 className="header-title">{config.emoji} {config.title}</h1>
            <p className="header-subtitle">
              {searchQuery.trim()
                ? <>搜索“<strong>{searchQuery.trim()}</strong>”找到 <strong>{filteredDishes.length}</strong> 道</>
                : <>共 <strong>{filteredDishes.length}</strong> 道</>}
            </p>
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
            placeholder="搜索菜品或食材（应季模式也搜全库）"
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
          searchQuery.trim() ? null : (
            <SeasonalBanner type={activeTag} count={filteredDishes.length} selectedMonth={selectedMonth} onChangeMonth={setSelectedMonth} />
          )
        ) : null}
        {/* 搜索模式：如果搜索词匹配已知食材，先展示食材农残信息（支持多条） */}
        {searchedIngredients.length > 0 && (
          <div className="seasonal-banner" style={{ margin: '12px 16px 0' }}>
            <div className="seasonal-banner-header">
              <span className="seasonal-icon">🥬</span>
              <span className="seasonal-title">食材农残</span>
              <span className="seasonal-count">找到 {searchedIngredients.length} 个相关</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {searchedIngredients.map(item => {
                const colors = RISK_COLORS[item.level];
                const label = RISK_LABELS[item.level];
                const recs = getOriginRecommendations(item.matchedWord);
                return (
                  <div key={item.matchedWord}>
                    <div className="seasonal-tags">
                      <span
                        className="seasonal-tag has-risk"
                        style={{
                          '--risk-bg': colors.bg,
                          '--risk-border': colors.border,
                          '--risk-text': colors.text,
                        }}
                        title={label.desc}
                      >
                        {item.matchedWord}
                        <span className="risk-dot" style={{ backgroundColor: colors.text }} />
                      </span>
                      <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', alignSelf: 'center' }}>
                        {label.label} · {label.desc}
                      </span>
                    </div>
                    {recs && recs.length > 0 && (
                      <p style={{ fontSize: 12, color: '#8D6E00', marginTop: 2, lineHeight: 1.5 }}>
                        💡 {item.matchedWord}建议选择<strong>{recs.map(r => r.origin).join('、')}</strong>等产地，可降低农残
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {filteredDishes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">{config.empty}</div>
            <p className="empty-text">
              {searchQuery.trim() && searchedIngredients.length > 0 ? (
                <>暂无含“<strong>{searchQuery.trim()}</strong>”的菜品，试试其他关键词</>
              ) : searchQuery.trim() ? (
                <>未搜到“<strong>{searchQuery.trim()}</strong>”相关的菜品</>
              ) : activeTag === '应季菜' || activeTag === '应季水果' ? (
                `${getSeasonalData(selectedMonth).months.join('、')} 月应季食材中还没有匹配的菜品`
              ) : (
                `暂无${config.title}`
              )}
            </p>
            <p className="empty-hint">
              {searchQuery.trim()
                ? '试试简化关键词，或点上面“菜品”标签浏览全部'
                : '点击下方 + 添加新菜品'}
            </p>
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
function SeasonalBanner({ type, count, selectedMonth, onChangeMonth }) {
  const data = getSeasonalData(selectedMonth);
  const isDish = type === '应季菜';
  const icon = isDish ? '🌱' : '🍓';
  const rangeText = `${data.months[0]}–${data.months[2]} 月`;
  const title = isDish
    ? `${rangeText}威海应季菜`
    : `${rangeText}应季水果`;

  const goPrev = () => {
    const m = selectedMonth - 1;
    onChangeMonth(m < 1 ? 12 : m);
  };
  const goNext = () => {
    const m = selectedMonth + 1;
    onChangeMonth(m > 12 ? 1 : m);
  };

  return (
    <div className="seasonal-banner">
      <div className="seasonal-banner-header">
        <span className="seasonal-icon">{icon}</span>
        <span className="seasonal-title">{title}</span>
        <span className="seasonal-count">匹配 {count} 道菜</span>
      </div>
      <div className="seasonal-month-bar">
        <button type="button" className="seasonal-month-btn" onClick={goPrev} aria-label="上个月">‹</button>
        <span className="seasonal-month-label">{selectedMonth} 月</span>
        <button type="button" className="seasonal-month-btn" onClick={goNext} aria-label="下个月">›</button>
        <span className="seasonal-month-range">（{data.months[0]}–{data.months[2]} 月）</span>
      </div>

      {/* 所有应季食材农残风险总览 — 先于月份块展示 */}
      <RiskOverview data={data} isDish={isDish} />

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


/**
 * 应季食材农残风险总览卡片
 * 收集所有月份的所有食材，按风险等级分组展示，先展示风险信息再展示菜品
 */
function RiskOverview({ data, isDish }) {
  // 收集所有月份的所有食材名称
  const allIngredients = [];
  data.byMonth.forEach(m => {
    if (isDish) {
      m.veggies.forEach(v => allIngredients.push(v));
    } else {
      m.fruitsLocal.forEach(f => allIngredients.push(f));
      m.fruitsOther.forEach(f => allIngredients.push(f.name));
    }
  });
  // 去重
  const unique = [...new Set(allIngredients)];
  if (unique.length === 0) return null;

  // 按风险等级分组
  const groups = { high: [], moderate: [], low: [], unknown: [] };
  unique.forEach(name => {
    const risk = getPesticideRisk(name);
    if (risk === 'high') groups.high.push(name);
    else if (risk === 'moderate') groups.moderate.push(name);
    else if (risk === 'low') groups.low.push(name);
    else groups.unknown.push(name);
  });

  // 风险等级优先级展示顺序
  const riskOrder = [
    { key: 'high', emoji: '🔴', label: '高农残·建议选有机', items: groups.high },
    { key: 'moderate', emoji: '🟡', label: '中等农残·正常清洗即可', items: groups.moderate },
    { key: 'low', emoji: '🟢', label: '低农残·放心买普通', items: groups.low },
  ];
  const hasRisks = riskOrder.some(g => g.items.length > 0);
  if (!hasRisks) return null;

  return (
    <div className="risk-overview">
      <div className="risk-overview-title">
        {isDish ? '🥬' : '🍓'} 食材农残风险一览
      </div>
      {riskOrder.map(group =>
        group.items.length > 0 ? (
          <div key={group.key} className="risk-overview-group">
            <div className="risk-overview-group-label" style={{
              color: group.key === 'high' ? '#C62828' : group.key === 'moderate' ? '#F57F17' : '#2E7D32',
            }}>
              {group.emoji} {group.label}
              <span className="risk-overview-count">{group.items.length} 种</span>
            </div>
            <div className="seasonal-tags">
              {group.items.map(name => (
                <SeasonalTagWithRisk key={name} name={name} />
              ))}
            </div>
          </div>
        ) : null
      )}
    </div>
  );
}

/** 单个月份的食材块：蔬野菜+海鲜 或 本地水果+其他产区水果 */
function SeasonalMonthBlock({ monthData, isDish }) {
  const { month, veggies, seafood, fruitsLocal, fruitsOther } = monthData;
  const hasAny =
    veggies.length + seafood.length + fruitsLocal.length + fruitsOther.length > 0;
  if (!hasAny) return null;

  // 收集有产地推荐的食材提示
  const collectOriginTips = (items) => {
    const seen = new Set();
    const tips = [];
    items.forEach(item => {
      const name = typeof item === 'string' ? item : item.name;
      if (!name || seen.has(name)) return;
      const recs = getOriginRecommendations(name);
      if (recs && recs.length > 0) {
        seen.add(name);
        tips.push({ name, origins: recs.map(r => r.origin).join('、') });
      }
    });
    return tips;
  };

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
              {renderOriginTips(collectOriginTips(veggies))}
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
              {renderOriginTips(collectOriginTips(fruitsLocal))}
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
              {renderOriginTips(collectOriginTips(fruitsOther))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/** 产地推荐提示渲染 */
function renderOriginTips(tips) {
  if (tips.length === 0) return null;
  return (
    <div className="seasonal-origin-tips">
      {tips.map(tip => (
        <p key={tip.name} className="seasonal-origin-tip">
          💡 {tip.name}：选择 <strong>{tip.origins}</strong> 等产地可降低农残
        </p>
      ))}
    </div>
  );
}

/** 单个应季食材标签 + 农残风险指示器（文本显式标签） */
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
          className="risk-badge-text"
          style={{
            backgroundColor: colors.text,
            color: '#fff',
          }}
        >
          {label.text}
        </span>
      )}
    </span>
  );
}
