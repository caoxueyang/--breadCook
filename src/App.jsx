import { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider } from './contexts/DataContext';
import { ToastProvider } from './contexts/ToastContext';
import SplashScreen from './components/SplashScreen';
import TabBar from './components/TabBar';
import DietTracker from './components/DietTracker';
import UndoDeleteToast from './components/UndoDeleteToast';
import Home from './pages/Home';
import Category from './pages/Category';
import DishDetail from './pages/DishDetail';
import DishEdit from './pages/DishEdit';
import Settings from './pages/Settings';
import FreezingGuide from './pages/FreezingGuide';
import { useBackButton } from './hooks/useBackButton';
import './pages/Page.css';

function ExitConfirmModal({ open, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div
      className="modal-overlay"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="modal-title">退出应用</p>
        <p className="modal-text">确定要退出应用吗？</p>
        <div className="modal-actions">
          <button
            type="button"
            className="modal-btn cancel"
            onClick={onCancel}
          >
            取消
          </button>
          <button
            type="button"
            className="modal-btn confirm"
            onClick={onConfirm}
          >
            确认
          </button>
        </div>
      </div>
    </div>
  );
}

function AppShell() {
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Android 手势返回 / 硬件返回键 统一拦截
  useBackButton(() => setShowExitConfirm(true));

  const handleConfirmExit = () => {
    setShowExitConfirm(false);
    try {
      CapacitorApp.exitApp();
    } catch (_) {
      // 浏览器调试时无此 API，忽略
    }
  };

  return (
    <SplashScreen>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/dishes" replace />} />
            <Route path="/favs" element={<Home />} />
            <Route path="/dish/:id" element={<DishDetail />} />
            <Route path="/edit/:id" element={<DishEdit />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/freezing-guide" element={<FreezingGuide />} />
            <Route path="/:category" element={<Category />} />
          </Routes>
        </div>
        <TabBar />
      </div>
      <DietTracker />
      <UndoDeleteToast />
      <ExitConfirmModal
        open={showExitConfirm}
        onCancel={() => setShowExitConfirm(false)}
        onConfirm={handleConfirmExit}
      />
    </SplashScreen>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <ToastProvider>
          <HashRouter>
            <AppShell />
          </HashRouter>
        </ToastProvider>
      </DataProvider>
    </ThemeProvider>
  );
}
