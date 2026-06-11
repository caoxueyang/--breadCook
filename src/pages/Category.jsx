import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import TagFilter from '../components/TagFilter';
import DishCard from '../components/DishCard';
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
    if (activeTag) {
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
        {filteredDishes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">{config.empty}</div>
            <p className="empty-text">暂无{config.title}</p>
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
