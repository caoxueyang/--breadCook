import { useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { getDish } from '../utils/storage';
import './DishEdit.css';
import './Page.css';

const CATEGORIES = [
  { key: 'dishes', label: '菜品', emoji: '🍳' },
  { key: 'drinks', label: '酒品', emoji: '🍹' },
  { key: 'desserts', label: '甜品', emoji: '🍰' },
];

const CATEGORY_TAGS = {
  dishes: ['包包的最爱', '我的最爱', '应季菜', '东北菜', '白人饭'],
  drinks: ['包包的最爱', '我的最爱', '饮料', '酒'],
  desserts: ['包包的最爱', '我的最爱', '甜品'],
};

export default function DishEdit() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addDish, updateDish, dishes } = useData();
  const fileInputRef = useRef(null);

  const isNew = id === 'new';
  const existingDish = !isNew ? (dishes.find(d => d.id === id) || getDish(id)) : null;

  const [name, setName] = useState(existingDish?.name || '');
  const [category, setCategory] = useState(
    existingDish?.category || searchParams.get('category') || 'dishes'
  );
  const [tags, setTags] = useState(existingDish?.tags || []);
  const [recipe, setRecipe] = useState(existingDish?.recipe || '');
  const [image, setImage] = useState(existingDish?.image || '');

  const toggleTag = (tag) => {
    setTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 压缩图片
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX = 800;
        let w = img.width, h = img.height;
        if (w > MAX || h > MAX) {
          if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
          else { w = Math.round(w * MAX / h); h = MAX; }
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        setImage(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('请输入菜名');
      return;
    }
    const data = { name: name.trim(), category, tags, recipe, image };
    if (isNew) {
      addDish(data);
    } else {
      updateDish(id, data);
    }
    navigate(-1);
  };

  return (
    <div className="page">
      <header className="edit-header safe-area-top">
        <button className="header-back-btn" onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text)" strokeWidth="2.5" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <span className="edit-header-title">{isNew ? '新增菜品' : '编辑菜品'}</span>
        <button className="edit-save-btn" onClick={handleSave}>保存</button>
      </header>

      <div className="page-content-full edit-content">
        {/* 图片区域 */}
        <div className="edit-image-section" onClick={() => fileInputRef.current?.click()}>
          {image ? (
            <div className="edit-image-preview">
              <img src={image} alt="预览" />
              <div className="edit-image-overlay">点击更换</div>
            </div>
          ) : (
            <div className="edit-image-placeholder">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5" strokeLinecap="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <path d="M21 15l-5-5L5 21"/>
              </svg>
              <span>📷 点击添加/更换图片</span>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageSelect}
          />
        </div>

        {image && (
          <button className="edit-remove-img" onClick={() => setImage('')}>
            移除图片
          </button>
        )}

        {/* 菜名 */}
        <div className="edit-field">
          <label className="edit-label">菜名 *</label>
          <input
            className="edit-input"
            type="text"
            placeholder="输入菜品名称"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={50}
          />
        </div>

        {/* 分类 */}
        <div className="edit-field">
          <label className="edit-label">分类</label>
          <div className="edit-category-group">
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                className={`edit-category-btn ${category === cat.key ? 'active' : ''}`}
                onClick={() => setCategory(cat.key)}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 标签 */}
        <div className="edit-field">
          <label className="edit-label">标签（可多选）</label>
          <div className="edit-tags-group">
            {(CATEGORY_TAGS[category] || []).map(tag => (
              <button
                key={tag}
                className={`edit-tag-btn ${tags.includes(tag) ? 'active' : ''}`}
                onClick={() => toggleTag(tag)}
              >
                {tags.includes(tag) ? '✓ ' : ''}{tag}
              </button>
            ))}
          </div>
        </div>

        {/* 做法 */}
        <div className="edit-field">
          <label className="edit-label">做法</label>
          <textarea
            className="edit-textarea"
            placeholder="记录做法步骤...&#10;&#10;例如：&#10;材料：xxx&#10;&#10;做法：&#10;1. xxx&#10;2. xxx"
            value={recipe}
            onChange={e => setRecipe(e.target.value)}
            rows={10}
          />
        </div>
      </div>
    </div>
  );
}
