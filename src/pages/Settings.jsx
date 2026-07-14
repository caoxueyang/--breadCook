import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';
import { exportData, importData } from '../utils/storage';
import { THEME_AVATARS } from '../utils/defaultImages';
import { getCustomFoods } from '../utils/foodDatabase';
import CustomFoodManager from '../components/CustomFoodManager';
import './Settings.css';
import './Page.css';

const THEME_BACKGROUNDS = {
  pompompurin: 'linear-gradient(135deg, #FFF8E7 0%, #FFE4A0 100%)',
  hellokitty: 'linear-gradient(135deg, #FFF0F3 0%, #FFD9E0 100%)',
  minimal: 'linear-gradient(135deg, #FAFAFA 0%, #E0E0E0 100%)'
};

// 导入文件大小限制（10MB，远超实际数据量 1MB）
const MAX_IMPORT_SIZE = 10 * 1024 * 1024;

/**
 * 校验导入文件：返回 { ok, parsed, error, stats }
 *  - 必须是 JSON
 *  - 必须含 dishes 字段且是数组
 *  - 单文件大小限制
 */
function validateImportPayload(text) {
  if (!text || !text.trim()) {
    return { ok: false, error: '文件内容为空' };
  }
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: 'JSON 解析失败，文件可能已损坏' };
  }
  if (!parsed || typeof parsed !== 'object') {
    return { ok: false, error: 'JSON 顶层必须是对象' };
  }
  if (!Array.isArray(parsed.dishes)) {
    return { ok: false, error: '缺少 dishes 数组字段，不是菜单备份文件' };
  }
  // 简单统计
  const dishes = parsed.dishes;
  const catCount = { dishes: 0, drinks: 0, desserts: 0 };
  for (const d of dishes) {
    if (d && d.category && catCount[d.category] !== undefined) catCount[d.category]++;
  }
  return {
    ok: true,
    parsed,
    stats: {
      total: dishes.length,
      dishes: catCount.dishes,
      drinks: catCount.drinks,
      desserts: catCount.desserts,
      hasTheme: typeof parsed.theme === 'string',
    },
  };
}

export default function Settings() {
  const navigate = useNavigate();
  const { theme, setTheme, themes } = useTheme();
  const { importDishes, dishes: currentDishes } = useData();
  const fileInputRef = useRef(null);

  // 导入预览 modal：选中文件后等用户确认才执行
  const [importPreview, setImportPreview] = useState(null); // { parsed, stats, rawText }
  const [importError, setImportError] = useState('');

  // 「我的常吃」食物管理 Modal
  const [customFoodOpen, setCustomFoodOpen] = useState(false);
  const [customFoodCount, setCustomFoodCount] = useState(() => getCustomFoods().length);
  const openCustomFood = () => {
    setCustomFoodCount(getCustomFoods().length);
    setCustomFoodOpen(true);
  };
  const refreshCustomFoodCount = () => setCustomFoodCount(getCustomFoods().length);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `菜单备份_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSelectFile = (e) => {
    const file = e.target.files?.[0];
    // 重置 input value 允许重复选同一文件
    if (e.target) e.target.value = '';
    if (!file) return;
    setImportError('');

    if (file.size > MAX_IMPORT_SIZE) {
      setImportError(`文件过大（${(file.size / 1024 / 1024).toFixed(2)}MB），超过 10MB 上限`);
      return;
    }
    if (!file.name.toLowerCase().endsWith('.json') && file.type !== 'application/json') {
      setImportError('请选择 .json 格式的备份文件');
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = validateImportPayload(ev.target.result);
      if (!result.ok) {
        setImportError(result.error);
        return;
      }
      setImportPreview({ parsed: result.parsed, stats: result.stats, rawText: ev.target.result });
    };
    reader.onerror = () => setImportError('文件读取失败');
    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (!importPreview) return;
    const ok = importData(importPreview.rawText);
    if (ok) {
      importDishes(importPreview.parsed);
      if (importPreview.parsed.theme) setTheme(importPreview.parsed.theme);
      setImportPreview(null);
      navigate('/favs');
    } else {
      setImportError('写入失败：localStorage 可能已满');
      setImportPreview(null);
    }
  };

  const handleCancelImport = () => {
    setImportPreview(null);
  };

  const currentCount = currentDishes?.length || 0;

  return (
    <div className="page">
      <header className="edit-header safe-area-top">
        <button className="header-back-btn" onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text)" strokeWidth="2.5" strokeLinecap="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <span className="edit-header-title">设置</span>
        <div style={{ width: 40 }} />
      </header>

      <div className="page-content-full settings-content">
        {/* 主题切换 */}
        <div className="settings-section">
          <h2 className="settings-section-title">主题风格</h2>
          <div className="theme-list">
            {Object.values(themes).map(t => (
              <button
                key={t.key}
                className={`theme-card ${theme === t.key ? 'active' : ''}`}
                onClick={() => setTheme(t.key)}
              >
                <div className="theme-icon" style={{ background: THEME_BACKGROUNDS[t.key] }}>
                  {THEME_AVATARS[t.key] ? (
                    <img src={THEME_AVATARS[t.key]} alt={t.name} loading="lazy" />
                  ) : (
                    <span className="theme-icon-emoji">{t.emoji}</span>
                  )}
                </div>
                <div className="theme-info">
                  <span className="theme-name">{t.emoji} {t.name}</span>
                  <span className="theme-desc">{t.desc}</span>
                </div>
                {theme === t.key && (
                  <span className="theme-check">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 数据管理 */}
        <div className="settings-section">
          <h2 className="settings-section-title">数据管理</h2>
          {importError && (
            <div className="settings-import-error">
              ❌ {importError}
            </div>
          )}
          <div className="settings-actions">
            <button className="settings-action-btn" onClick={handleExport}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2" strokeLinecap="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              <div>
                <span className="action-title">导出数据</span>
                <span className="action-desc">将所有菜品导出为JSON文件</span>
              </div>
            </button>
            <button className="settings-action-btn" onClick={() => fileInputRef.current?.click()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2" strokeLinecap="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <div>
                <span className="action-title">导入数据</span>
                <span className="action-desc">从JSON备份文件恢复（需确认）</span>
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              style={{ display: 'none' }}
              onChange={handleSelectFile}
            />
          </div>
        </div>

        {/* 饮食计划 */}
        <div className="settings-section">
          <h2 className="settings-section-title">饮食计划</h2>
          <div className="settings-actions">
            <button className="settings-action-btn" onClick={openCustomFood}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2" strokeLinecap="round">
                <path d="M3 11h18M5 11V7a2 2 0 012-2h10a2 2 0 012 2v4M7 16h10M9 20h6"/>
              </svg>
              <div>
                <span className="action-title">
                  我的常吃食物
                  {customFoodCount > 0 && (
                    <span className="action-badge">{customFoodCount}</span>
                  )}
                </span>
                <span className="action-desc">自定义加入「今日饮食」选择器，例如自制蛋白棒</span>
              </div>
            </button>
          </div>
        </div>

        {/* 食材冷冻指南 */}
        <div className="settings-section">
          <h2 className="settings-section-title">🍽️ 厨房工具</h2>
          <div className="settings-actions">
            <button className="settings-action-btn" onClick={() => navigate('/freezing-guide')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" strokeWidth="2" strokeLinecap="round">
                <rect x="4" y="8" width="16" height="12" rx="2" />
                <path d="M4 8V6a2 2 0 012-2h12a2 2 0 012 2v2" />
                <path d="M8 4v4M16 4v4" />
                <circle cx="12" cy="14" r="2" />
              </svg>
              <div>
                <span className="action-title">🧊 食材冷冻指南</span>
                <span className="action-desc">查看各类食材冷冻保存方法、处理方式与保质期限</span>
              </div>
            </button>
          </div>
        </div>

        {/* 关于 */}
        <div className="settings-section">
          <h2 className="settings-section-title">关于</h2>
          <div className="settings-about">
            <p className="about-name">面包の餐厅 v1.0</p>
            <p className="about-desc">记录家的味道，随时查看你的私房菜谱</p>
            <p className="about-tech">React + Vite | 支持 PWA 与 Capacitor</p>
          </div>
        </div>
      </div>

      {/* 导入确认 Modal：必须用户二次确认才覆盖 */}
      {importPreview && (
        <div className="modal-overlay" onClick={handleCancelImport}>
          <div className="modal-box settings-import-modal animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <p className="modal-title">⚠️ 确认导入</p>
            <p className="modal-text">即将覆盖当前所有数据，请确认：</p>
            <div className="settings-import-preview">
              <div className="settings-import-stat">
                <span className="stat-label">🍳 菜品</span>
                <span className="stat-value">{importPreview.stats.dishes}</span>
              </div>
              <div className="settings-import-stat">
                <span className="stat-label">🍹 酒品</span>
                <span className="stat-value">{importPreview.stats.drinks}</span>
              </div>
              <div className="settings-import-stat">
                <span className="stat-label">🍰 甜品</span>
                <span className="stat-value">{importPreview.stats.desserts}</span>
              </div>
              <div className="settings-import-stat total">
                <span className="stat-label">📊 总计</span>
                <span className="stat-value">{importPreview.stats.total} 道</span>
              </div>
              {importPreview.stats.hasTheme && (
                <div className="settings-import-stat theme">
                  <span className="stat-label">🎨 主题</span>
                  <span className="stat-value">将切换</span>
                </div>
              )}
            </div>
            <div className="settings-import-warning">
              <b>当前数据：{currentCount} 道菜品</b>，导入后将被替换，<b>无法撤销</b>。
              <br />
              建议先「导出数据」备份当前内容。
            </div>
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={handleCancelImport}>取消</button>
              <button className="modal-btn confirm-pw" onClick={handleConfirmImport}>
                确认覆盖导入
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 「我的常吃食物」管理 Modal */}
      <CustomFoodManager
        open={customFoodOpen}
        onClose={() => {
          setCustomFoodOpen(false);
          refreshCustomFoodCount();
        }}
        onAdded={refreshCustomFoodCount}
      />
    </div>
  );
}
