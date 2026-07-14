// 自定义食物管理器（Modal）
// ① 顶部：新建表单（名称/分类/单位/每份克数/三大宏量素）
// ② 中部：已添加的自定义食物列表（可删除）
// 用法：<CustomFoodManager open onClose onAdded={fn} />
import { useEffect, useState } from 'react';
import {
  addCustomFood,
  getCustomFoods,
  removeCustomFood,
  subscribeCustomFoods,
  FOOD_DB,
} from '../utils/foodDatabase';
import './CustomFoodManager.css';

const CATEGORY_OPTIONS = [
  { key: 'carbs',    label: '碳水',   icon: '🍚' },
  { key: 'protein',  label: '蛋白',   icon: '🥩' },
  { key: 'fat',      label: '脂肪',   icon: '🥑' },
  { key: 'vegetable',label: '蔬菜',   icon: '🥬' },
  { key: 'fruit',    label: '水果',   icon: '🍎' },
  { key: 'drink',    label: '饮品',   icon: '🥤' },
];

const EMPTY_FORM = {
  name: '',
  category: 'carbs',
  unit: '份',
  weightG: 100,
  carbs: 0,
  protein: 0,
  fat: 0,
};

function validate(form) {
  if (!form.name || !form.name.trim()) return '请填写食物名称';
  const w = Number(form.weightG);
  if (!Number.isFinite(w) || w <= 0) return '每份克数必须 > 0';
  const macroSum = Number(form.carbs || 0) + Number(form.protein || 0) + Number(form.fat || 0);
  if (macroSum <= 0) return '三大宏量素至少填一个 > 0';
  return null;
}

export default function CustomFoodManager({ open, onClose, onAdded }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [list, setList] = useState(() => (open ? getCustomFoods() : []));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return undefined;
    setForm(EMPTY_FORM);
    setError('');
    setList(getCustomFoods());
    return subscribeCustomFoods(() => setList(getCustomFoods()));
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleField = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    const err = validate(form);
    if (err) {
      setError(err);
      return;
    }
    const record = addCustomFood(form);
    setForm(EMPTY_FORM);
    setError('');
    if (onAdded) onAdded(record);
  };

  const handleRemove = (id) => {
    if (!window.confirm('确定删除这个自定义食物吗？')) return;
    removeCustomFood(id);
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="自定义食物管理"
    >
      <div className="modal-box cfm-modal" onClick={(e) => e.stopPropagation()}>
        {/* 头部 */}
        <div className="cfm-header">
          <div className="cfm-header-left">
            <span className="cfm-header-icon">🍳</span>
            <div>
              <div className="modal-title" style={{ textAlign: 'left', marginBottom: 0 }}>
                我的常吃食物
              </div>
              <div className="cfm-header-sub">
                自定义的会出现在饮食计划的选择器里
              </div>
            </div>
          </div>
          <button
            type="button"
            className="dt-close-btn"
            onClick={onClose}
            aria-label="关闭"
          >
            ✕
          </button>
        </div>

        {/* 新建表单 */}
        <form className="cfm-form" onSubmit={handleSubmit}>
          <div className="cfm-form-title">＋ 新建一个</div>
          <div className="cfm-row">
            <label className="cfm-field cfm-field-grow">
              <span className="cfm-label">名称 *</span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleField('name', e.target.value)}
                placeholder="例：自制蛋白棒"
                maxLength={20}
                className="cfm-input"
                required
              />
            </label>
            <label className="cfm-field">
              <span className="cfm-label">单位</span>
              <input
                type="text"
                value={form.unit}
                onChange={(e) => handleField('unit', e.target.value)}
                placeholder="份/块/杯"
                maxLength={6}
                className="cfm-input cfm-input-sm"
              />
            </label>
          </div>

          <div className="cfm-row">
            <div className="cfm-field cfm-field-grow">
              <span className="cfm-label">分类 *</span>
              <div className="cfm-cat-list">
                {CATEGORY_OPTIONS.map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    className={`cfm-cat-chip ${form.category === c.key ? 'is-active' : ''}`}
                    onClick={() => handleField('category', c.key)}
                  >
                    <span>{c.icon}</span>
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="cfm-row">
            <label className="cfm-field">
              <span className="cfm-label">每份克数 *</span>
              <div className="cfm-unit-input">
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={form.weightG}
                  onChange={(e) => handleField('weightG', e.target.value)}
                  className="cfm-input cfm-input-sm"
                />
                <span className="cfm-unit-suffix">g</span>
              </div>
            </label>
            <label className="cfm-field">
              <span className="cfm-label">🍚 碳水 g</span>
              <input
                type="number"
                min="0"
                step="0.1"
                value={form.carbs}
                onChange={(e) => handleField('carbs', e.target.value)}
                className="cfm-input cfm-input-sm"
              />
            </label>
            <label className="cfm-field">
              <span className="cfm-label">🥩 蛋白 g</span>
              <input
                type="number"
                min="0"
                step="0.1"
                value={form.protein}
                onChange={(e) => handleField('protein', e.target.value)}
                className="cfm-input cfm-input-sm"
              />
            </label>
            <label className="cfm-field">
              <span className="cfm-label">🥑 脂肪 g</span>
              <input
                type="number"
                min="0"
                step="0.1"
                value={form.fat}
                onChange={(e) => handleField('fat', e.target.value)}
                className="cfm-input cfm-input-sm"
              />
            </label>
          </div>

          {error && <div className="cfm-error">⚠️ {error}</div>}

          <div className="cfm-form-actions">
            <button type="button" className="modal-btn cancel" onClick={onClose}>
              关闭
            </button>
            <button type="submit" className="modal-btn confirm">
              ➕ 添加到我的常吃
            </button>
          </div>
        </form>

        {/* 已有列表 */}
        <div className="cfm-list-section">
          <div className="cfm-list-title">
            <span>已添加（{list.length}）</span>
            {list.length === 0 && (
              <span className="cfm-list-empty">还没有，去上面建一个吧</span>
            )}
          </div>
          {list.length > 0 && (
            <ul className="cfm-list">
              {list.map((f) => {
                const cat = CATEGORY_OPTIONS.find((c) => c.key === f.category) || CATEGORY_OPTIONS[0];
                return (
                  <li key={f.id} className="cfm-list-item">
                    <span className="cfm-list-icon" aria-hidden="true">{cat.icon}</span>
                    <div className="cfm-list-body">
                      <div className="cfm-list-name">{f.name}</div>
                      <div className="cfm-list-meta">
                        {f.weightG}g/{f.unit} · 碳 {f.carbs}g · 蛋 {f.protein}g · 脂 {f.fat}g
                      </div>
                    </div>
                    <button
                      type="button"
                      className="cfm-list-del"
                      onClick={() => handleRemove(f.id)}
                      aria-label={`删除 ${f.name}`}
                      title="删除"
                    >
                      🗑
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
