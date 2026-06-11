import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { DataProvider } from './contexts/DataContext';
import SplashScreen from './components/SplashScreen';
import TabBar from './components/TabBar';
import Home from './pages/Home';
import Category from './pages/Category';
import DishDetail from './pages/DishDetail';
import DishEdit from './pages/DishEdit';
import Settings from './pages/Settings';

export default function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <HashRouter>
          <SplashScreen>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <Routes>
                  <Route path="/" element={<Navigate to="/dishes" replace />} />
                  <Route path="/favs" element={<Home />} />
                  <Route path="/dish/:id" element={<DishDetail />} />
                  <Route path="/edit/:id" element={<DishEdit />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/:category" element={<Category />} />
                </Routes>
              </div>
              <TabBar />
            </div>
          </SplashScreen>
        </HashRouter>
      </DataProvider>
    </ThemeProvider>
  );
}
