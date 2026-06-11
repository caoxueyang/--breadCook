import { useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import back1 from '../assets/huangbai/back1.jpeg';
import back2 from '../assets/huangbai/back2.jpg';
import back3 from '../assets/huangbai/back3.webp';
import back4 from '../assets/huangbai/back4.jpg';
import './TabBar.css';

const TABS = [
  { path: '/dishes', label: '菜品', icon: 'dish', bg: back4 },
  { path: '/drinks', label: '酒品', icon: 'drink', bg: back2 },
  { path: '/desserts', label: '甜品', icon: 'dessert', bg: back3 },
  { path: '/favs', label: '已选', icon: 'heart', bg: back1 },
];

function TabIcon({ type, active }) {
  const { theme } = useTheme();
  const color = active ? 'var(--color-tab-active)' : 'var(--color-tab-inactive)';
  const strokeW = active ? 2.2 : 1.8;

  const icons = {
    home: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
        <path d="M9 21V12h6v9"/>
      </svg>
    ),
    heart: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? color : 'none'} stroke={color} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    dish: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12h18"/>
        <path d="M4 12c0 4.4 3.6 8 8 8s8-3.6 8-8"/>
        <path d="M4 12c0-2 1.5-5 8-5s8 3 8 5"/>
        <circle cx="12" cy="5" r="1" fill={color}/>
      </svg>
    ),
    drink: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 2h8l-1 8H9L8 2z"/>
        <path d="M9 10h6v1c0 3-1.5 5-3 5s-3-2-3-5v-1z"/>
        <path d="M12 16v4"/>
        <path d="M8 20h8"/>
      </svg>
    ),
    dessert: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeW} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C9 2 7 4 7 6c0 1.5.8 2.8 2 3.5V11h6V9.5c1.2-.7 2-2 2-3.5 0-2-2-4-5-4z"/>
        <rect x="6" y="11" width="12" height="4" rx="1"/>
        <path d="M7 15l1 7h8l1-7"/>
      </svg>
    ),
  };

  return icons[type] || null;
}

export default function TabBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme } = useTheme();

  // 只在主tab页面显示底部导航
  const mainPaths = ['/favs', '/dishes', '/drinks', '/desserts'];
  if (!mainPaths.includes(location.pathname)) return null;

  const activeTab = TABS.find(t => t.path === location.pathname) || TABS[0];

  return (
    <nav className={`tab-bar safe-area-bottom theme-${theme}`}>
      {theme === 'pompompurin' && (
        <div className="tab-bar-bg" style={{ backgroundImage: `url(${activeTab.bg})` }} />
      )}
      {TABS.map(tab => {
        const active = location.pathname === tab.path;
        return (
          <button
            key={tab.path}
            className={`tab-item ${active ? 'active' : ''}`}
            onClick={() => navigate(tab.path)}
          >
            <span className="tab-icon-wrap">
              <TabIcon type={tab.icon} active={active} />
            </span>
            <span className="tab-label">{tab.label}</span>
            <span className="tab-indicator" />
          </button>
        );
      })}
    </nav>
  );
}
