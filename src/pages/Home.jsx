import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import DishCard from '../components/DishCard';
import SeasonalSpotlight from '../components/SeasonalSpotlight';
import { pompAvatarUrl as pompAvatar, kittyFaceUrl as kittyAvatar } from '../utils/defaultImages';
import './Page.css';

const CAT_ORDER = ['dishes', 'drinks', 'desserts'];
const CAT_LABELS = { dishes: '🍳 菜品', drinks: '🍹 酒品', desserts: '🍰 甜品' };

export default function Home() {
  const { dishes, updateDish } = useData();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const [showMenuPreview, setShowMenuPreview] = useState(false);
  const [menuImageUrl, setMenuImageUrl] = useState(null);

  const grouped = useMemo(() => {
    const favs = dishes.filter(d => d.tags && d.tags.includes('想吃'));
    favs.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    const groups = {};
    CAT_ORDER.forEach(c => { groups[c] = []; });
    favs.forEach(d => {
      if (groups[d.category]) groups[d.category].push(d);
    });
    return { groups, total: favs.length, allFavs: favs };
  }, [dishes]);

  const allIds = useMemo(() => new Set(grouped.allFavs.map(d => d.id)), [grouped.allFavs]);
  const isAllSelected = selected.size === grouped.allFavs.length && grouped.allFavs.length > 0;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(allIds));
    }
  };

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleRemove = (id) => {
    const dish = dishes.find(d => d.id === id);
    if (!dish) return;
    const newTags = dish.tags.filter(t => t !== '想吃');
    updateDish(id, { tags: newTags });
  };

  const handleGenerateMenu = () => {
    if (selected.size === 0) return;
    setShowMenuPreview(true);
  };

  // 老板“点菜完成”，将所有已选项整理成菜单并清空已选
  const handleSendToChef = () => {
    if (grouped.allFavs.length === 0) return;
    setSelected(new Set(grouped.allFavs.map(d => d.id)));
    setShowMenuPreview(true);
  };

  // 发送完成后清空已选（删除“想吃”标签）
  const clearAllSelected = () => {
    const now = Date.now();
    grouped.allFavs.forEach(dish => {
      const newTags = (dish.tags || []).filter(t => t !== '想吃');
      updateDish(dish.id, { tags: newTags, updatedAt: now });
    });
  };

  const generateMenuImage = useCallback(async () => {
    const selectedDishes = grouped.allFavs.filter(d => selected.has(d.id));
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const W = 750;
    const PADDING = 40;
    const LINE_H = 42;
    const SECTION_GAP = 30;
    const HEADER_H = 180;

    // Calculate total height
    let totalH = HEADER_H + 30;
    CAT_ORDER.forEach(cat => {
      const items = selectedDishes.filter(d => d.category === cat);
      if (items.length > 0) {
        totalH += 55 + items.length * LINE_H + SECTION_GAP;
      }
    });
    totalH += 90; // footer

    canvas.width = W;
    canvas.height = totalH;

    // Background
    ctx.fillStyle = '#FFF8F0';
    ctx.fillRect(0, 0, W, totalH);

    // Header decoration
    const gradient = ctx.createLinearGradient(0, 0, W, HEADER_H);
    gradient.addColorStop(0, '#F6D365');
    gradient.addColorStop(1, '#FDA085');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(W, 0);
    ctx.lineTo(W, HEADER_H - 20);
    ctx.quadraticCurveTo(W / 2, HEADER_H + 15, 0, HEADER_H - 20);
    ctx.fill();

    // Title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🍞 面包の餐厅', W / 2, 70);

    ctx.font = 'bold 26px sans-serif';
    ctx.fillText('— 今日菜单 —', W / 2, 110);

    // Date
    const now = new Date();
    const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${['周日', '周一', '周二', '周三', '周四', '周五', '周六'][now.getDay()]} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    ctx.font = '20px sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.fillText(dateStr, W / 2, 150);

    let y = HEADER_H + 35;

    CAT_ORDER.forEach(cat => {
      const items = selectedDishes.filter(d => d.category === cat);
      if (items.length === 0) return;

      // Section title
      ctx.fillStyle = '#E8920B';
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(CAT_LABELS[cat], PADDING, y);

      // Underline
      const titleW = ctx.measureText(CAT_LABELS[cat]).width;
      ctx.strokeStyle = '#F6D365';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(PADDING, y + 10);
      ctx.lineTo(PADDING + titleW, y + 10);
      ctx.stroke();

      y += 35;

      items.forEach((item, i) => {
        ctx.fillStyle = '#333333';
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`${i + 1}. ${item.name}`, PADDING + 15, y);

        // Tags
        if (item.tags && item.tags.length > 0) {
          const tagStr = item.tags.filter(t => t !== '想吃' && t !== '我的最爱' && t !== '包包的最爱').join(' · ');
          if (tagStr) {
            ctx.fillStyle = '#AAAAAA';
            ctx.font = '17px sans-serif';
            const nameW = ctx.measureText(`${i + 1}. ${item.name}`).width;
            ctx.fillText(`  ${tagStr}`, PADDING + 15 + nameW, y);
          }
        }

        y += LINE_H;
      });

      y += SECTION_GAP;
    });

    // Footer
    ctx.fillStyle = '#CCCCCC';
    ctx.font = '18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`共 ${selectedDishes.length} 道菜 · 面包の餐厅`, W / 2, totalH - 35);

    // Show image for long-press save
    const dataUrl = canvas.toDataURL('image/png');
    setMenuImageUrl(dataUrl);

    // Also try download (works in browser)
    try {
      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `菜单_${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}.png`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
      }, 'image/png');
    } catch (e) {
      // Download not supported in WebView, image is shown for long-press
    }
  }, [grouped, selected]);

  return (
    <div className="page">
      <header className="page-header safe-area-top">
        <div className="header-top">
          <div className="header-left">
            <div className="header-avatar">
              {theme === 'pompompurin' && <img src={pompAvatar} alt="布丁狗" />}
              {theme === 'hellokitty' && <img src={kittyAvatar} alt="Kitty" />}
              {theme === 'minimal' && <span className="header-avatar-emoji">❤️</span>}
            </div>
            <div>
              <h1 className="header-title">已选</h1>
              <p className="header-subtitle">共 {grouped.total} 道</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {grouped.total > 0 && (
              <button
                className={`select-mode-btn ${selectMode ? 'active' : ''}`}
                onClick={() => { setSelectMode(!selectMode); setSelected(new Set()); }}
              >
                {selectMode ? '取消' : '管理'}
              </button>
            )}
            <button className="header-btn" onClick={() => navigate('/settings')}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="page-content">
        {/* 应季菜推荐（顶部 Spotlight） */}
        <SeasonalSpotlight dishes={dishes} />
        {grouped.total === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">❤️</div>
            <p className="empty-text">还没有选择</p>
            <p className="empty-hint">在菜品详情页点击「想吃」添加到这里吧！</p>
          </div>
        ) : (
          <>
            {CAT_ORDER.map(cat => {
              const items = grouped.groups[cat];
              if (items.length === 0) return null;
              return (
                <div key={cat} className="fav-section">
                  <h3 className="fav-section-title">{CAT_LABELS[cat]}</h3>
                  <div className="dish-grid">
                    {items.map(dish => (
                      <div key={dish.id} className="fav-item-wrapper">
                        <DishCard dish={dish} />
                        {selectMode && (
                          <>
                            <div
                              className={`fav-select-overlay ${selected.has(dish.id) ? 'selected' : ''}`}
                              onClick={() => toggleSelect(dish.id)}
                            >
                              <span className="fav-check">{selected.has(dish.id) ? '✓' : ''}</span>
                            </div>
                            <button
                              className="fav-remove-btn"
                              onClick={(e) => { e.stopPropagation(); handleRemove(dish.id); }}
                            >
                              ✕
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {selectMode && (
        <div className="fav-bottom-bar safe-area-bottom">
          <button className="fav-select-all-btn" onClick={toggleSelectAll}>
            <span className={`fav-checkbox ${isAllSelected ? 'checked' : ''}`}>
              {isAllSelected && '✓'}
            </span>
            全选
          </button>
          <button
            className={`fav-generate-btn ${selected.size > 0 ? 'active' : ''}`}
            onClick={handleGenerateMenu}
            disabled={selected.size === 0}
          >
            生成菜单 {selected.size > 0 && `(${selected.size})`}
          </button>
        </div>
      )}

      {showMenuPreview && !menuImageUrl && (
        <div className="modal-overlay" onClick={() => setShowMenuPreview(false)}>
          <div className="modal-box menu-preview-box animate-scale-in" onClick={e => e.stopPropagation()}>
            <p className="modal-title">📋 确认生成菜单</p>
            <p className="modal-text">将生成包含 {selected.size} 道菜品的长图菜单（生成后自动清空已选）</p>
            <div className="menu-preview-list">
              {CAT_ORDER.map(cat => {
                const items = grouped.allFavs.filter(d => d.category === cat && selected.has(d.id));
                if (items.length === 0) return null;
                return (
                  <div key={cat}>
                    <div className="menu-preview-cat">{CAT_LABELS[cat]}</div>
                    {items.map(d => (
                      <div key={d.id} className="menu-preview-item">· {d.name}</div>
                    ))}
                  </div>
                );
              })}
            </div>
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setShowMenuPreview(false)}>取消</button>
              <button className="modal-btn confirm-pw" onClick={() => { generateMenuImage(); }}>
                生成图片
              </button>
            </div>
          </div>
        </div>
      )}

      {menuImageUrl && (
        <div className="modal-overlay" onClick={() => { setMenuImageUrl(null); setShowMenuPreview(false); setSelectMode(false); setSelected(new Set()); }}>
          <div className="menu-image-preview animate-scale-in" onClick={e => e.stopPropagation()}>
            <p className="menu-image-hint">👆 长按图片保存到相册，即可分享给朋友</p>
            <img src={menuImageUrl} alt="今日菜单" className="menu-generated-img" />
            <button
              className="menu-image-close"
              onClick={() => {
                clearAllSelected();
                setMenuImageUrl(null);
                setShowMenuPreview(false);
                setSelectMode(false);
                setSelected(new Set());
              }}
            >
              完成（清空已选）
            </button>
          </div>
        </div>
      )}

      {/* 发给厨师浮动按钮：未进入管理模式时显示（只显示 emoji，不显示文字） */}
      {!selectMode && grouped.total > 0 && (
        <button className="fab fab-send-chef safe-area-bottom" onClick={handleSendToChef} title="发给厨师">
          <span className="fab-icon">👨‍🍳</span>
        </button>
      )}
    </div>
  );
}
