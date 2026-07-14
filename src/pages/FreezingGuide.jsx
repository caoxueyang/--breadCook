import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FREEZING_CATEGORIES, FREEZE_ITEMS } from '../utils/freezingGuide';
import { pinyinMatch } from '../utils/pinyin';
import './FreezingGuide.css';
import './Page.css';

export default function FreezingGuide() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    let result = FREEZE_ITEMS;
    const isSearching = searchQuery.trim().length > 0;

    if (!isSearching && activeCategory) {
      result = result.filter(item => item.category === activeCategory);
    }

    if (isSearching) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(item => {
        if (item.name.toLowerCase().includes(q)) return true;
        if (pinyinMatch(item.name, q)) return true;
        if (item.method.toLowerCase().includes(q)) return true;
        return false;
      });
    }

    return result;
  }, [activeCategory, searchQuery]);

  const currentCategory = FREEZING_CATEGORIES.find(c => c.key === activeCategory);
  const displayLabel = currentCategory ? currentCategory.emoji + ' ' + currentCategory.label.split(' ').slice(1).join(' ') : '全部食材';

  return (
    <div className="page">
      <header className="freeze-header safe-area-top">
        <div className="header-top">
          <div className="header-left">
            <button className="header-back-btn" onClick={() => navigate(-1)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text)" strokeWidth="2.5" strokeLinecap="round">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
            <div>
              <h1 className="header-title">🧊 食材冷冻指南</h1>
              <p className="header-subtitle">
                {searchQuery.trim()
                  ? <>搜索“<strong>{searchQuery.trim()}</strong>”找到 <strong>{filteredItems.length}</strong> 项</>
                  : <>{displayLabel} · 共 <strong>{filteredItems.length}</strong> 项</>}
              </p>
            </div>
          </div>
        </div>

        {/* 分类标签 */}
        <div className="freeze-tag-filter">
          <div className="freeze-tag-scroll">
            <button
              className={`freeze-tag-item ${!activeCategory ? 'active' : ''}`}
              onClick={() => setActiveCategory('')}
            >
              全部 🧊
            </button>
            {FREEZING_CATEGORIES.map(cat => (
              <button
                key={cat.key}
                className={`freeze-tag-item ${activeCategory === cat.key ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.key)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 搜索框 */}
        <div className="search-bar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="搜索食材名称或处理方法..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="search-clear" onClick={() => setSearchQuery('')}>✕</button>
          )}
        </div>
      </header>

      <div className="page-content">
        {filteredItems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🧊</div>
            <p className="empty-text">
              {searchQuery.trim()
                ? <>未搜到“<strong>{searchQuery.trim()}</strong>”相关的食材</>
                : '暂无该分类的冷冻食材'}
            </p>
            <p className="empty-hint">试试简化关键词，或切换分类标签</p>
          </div>
        ) : (
          <div className="freeze-list">
            {filteredItems.map(item => (
              <FreezeCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FreezeCard({ item }) {
  const catInfo = FREEZING_CATEGORIES.find(c => c.key === item.category);
  const badgeClass = item.directFreeze ? 'badge-ok' : 'badge-prep';

  return (
    <div className="freeze-card animate-fade-in">
      <div className="freeze-card-header">
        <div className="freeze-card-title-row">
          <span className="freeze-card-emoji">{catInfo?.emoji || '🧊'}</span>
          <span className="freeze-card-name">{item.name}</span>
          <span className={`freeze-badge ${badgeClass}`}>
            {item.directFreeze ? '✅ 直接冻' : '⚡ 需处理'}
          </span>
        </div>
        <span className="freeze-shelf-life">📅 {item.shelfLife}</span>
      </div>
      <div className="freeze-card-method">
        <span className="freeze-method-label">✏️ 处理方法：</span>
        {item.method}
      </div>
    </div>
  );
}
