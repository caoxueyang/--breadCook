import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';
import { exportData, importData } from '../utils/storage';
import pompAvatar from '../assets/huangbai/左上角.png';
import kittyAvatar from '../assets/kitty/hello-kitty-face.svg';
import './Settings.css';
import './Page.css';

const THEME_AVATARS = {
  pompompurin: pompAvatar,
  hellokitty: kittyAvatar,
  minimal: null
};

const THEME_BACKGROUNDS = {
  pompompurin: 'linear-gradient(135deg, #FFF8E7 0%, #FFE4A0 100%)',
  hellokitty: 'linear-gradient(135deg, #FFF0F3 0%, #FFD9E0 100%)',
  minimal: 'linear-gradient(135deg, #FAFAFA 0%, #E0E0E0 100%)'
};

export default function Settings() {
  const navigate = useNavigate();
  const { theme, setTheme, themes } = useTheme();
  const { importDishes } = useData();
  const fileInputRef = useRef(null);

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

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const success = importData(ev.target.result);
      if (success) {
        try {
          const parsed = JSON.parse(ev.target.result);
          importDishes(parsed);
          if (parsed.theme) setTheme(parsed.theme);
        } catch {}
        alert('导入成功！');
        navigate('/favs');
      } else {
        alert('导入失败：文件格式不正确');
      }
    };
    reader.readAsText(file);
  };

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
                    <img src={THEME_AVATARS[t.key]} alt={t.name} />
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
                <span className="action-desc">从JSON备份文件恢复数据</span>
              </div>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={handleImport}
            />
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
    </div>
  );
}
