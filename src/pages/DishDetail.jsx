import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import { getDish } from '../utils/storage';
import dish1 from '../assets/huangbai/12.jpg';
import dish2 from '../assets/huangbai/17.jpg';
import dish3 from '../assets/huangbai/18.jpg';
import dish4 from '../assets/huangbai/22.jpg';
import dish5 from '../assets/huangbai/55.webp';
import dish6 from '../assets/huangbai/61.jpg';
import dish7 from '../assets/huangbai/62.jpg';
import dish8 from '../assets/huangbai/63.jpg';
import dish9 from '../assets/huangbai/73.jpg';
import dish10 from '../assets/huangbai/76.jpg';
import dish11 from '../assets/huangbai/77.jpg';
import dish12 from '../assets/huangbai/85.webp';
import drink1 from '../assets/huangbai/11.jpg';
import drink2 from '../assets/huangbai/13.jpg';
import drink3 from '../assets/huangbai/15.jpg';
import drink4 from '../assets/huangbai/31.jpeg';
import drink5 from '../assets/huangbai/34.jpg';
import drink6 from '../assets/huangbai/65.jpg';
import drink7 from '../assets/huangbai/81.webp';
import dessert1 from '../assets/huangbai/2.webp';
import dessert2 from '../assets/huangbai/3.jpg';
import dessert3 from '../assets/huangbai/16.jpg';
import dessert4 from '../assets/huangbai/5.jpg';
import dessert5 from '../assets/huangbai/32.jpg';
import dessert6 from '../assets/huangbai/51.webp';
import dessert7 from '../assets/huangbai/64.jpg';
import dessert8 from '../assets/huangbai/i1.jpg';
import dessert9 from '../assets/huangbai/i2.jpg';
import dessert10 from '../assets/huangbai/71.jpg';
import dessert11 from '../assets/huangbai/72.jpg';
import dessert12 from '../assets/huangbai/78.jpg';
import dessert13 from '../assets/huangbai/79.jpg';
import dessert14 from '../assets/huangbai/80.png';
import dessert15 from '../assets/huangbai/82.webp';
import dessert16 from '../assets/huangbai/83.webp';
import dessert17 from '../assets/huangbai/84.webp';
import kittyFace from '../assets/kitty/hello-kitty-face.svg';
import CalorieEstimate from '../components/CalorieEstimate';
import './DishDetail.css';
import './Page.css';

const CATEGORY_NAMES = { dishes: '菜品', drinks: '酒品', desserts: '甜品' };

const POMP_IMAGES = {
  dishes: [dish1, dish2, dish3, dish4, dish5, dish6, dish7, dish8, dish9, dish10, dish11, dish12],
  drinks: [drink1, drink2, drink3, drink4, drink5, drink6, drink7],
  desserts: [dessert1, dessert2, dessert3, dessert4, dessert5, dessert6, dessert7, dessert8, dessert9, dessert10, dessert11, dessert12, dessert13, dessert14, dessert15, dessert16, dessert17],
};

function getPompImage(category, id) {
  const imgs = POMP_IMAGES[category] || POMP_IMAGES.dishes;
  const idx = (id || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0) % imgs.length;
  return imgs[idx];
}

function DefaultDetailImage({ category, theme, dishId }) {
  if (theme === 'pompompurin') {
    const src = getPompImage(category, dishId);
    return (
      <div className="detail-default-img">
        <img src={src} alt="默认图" />
      </div>
    );
  }
  // HelloKitty主题
  if (theme === 'hellokitty') {
    return (
      <div className="detail-default-img kitty-detail-bg">
        <img src={kittyFace} alt="Hello Kitty" className="kitty-face-lg" />
      </div>
    );
  }
  // 极简主题
  const emoji = { dishes: '◇', drinks: '◇', desserts: '◇' };
  return (
    <div className="detail-default-img minimal-detail-bg">
      <span>{emoji[category] || '🍽️'}</span>
    </div>
  );
}

export default function DishDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { dishes, deleteDish, updateDish } = useData();
  const { theme } = useTheme();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  // 本会话内验证过密码后，编辑不再重复弹出（删除仍每次验证）
  // 使用 sessionStorage 跨页导航保持状态
  const [editAuthorized, setEditAuthorized] = useState(() => {
    return sessionStorage.getItem('menu_app_edit_authorized') === 'true';
  });

  const ADMIN_PASSWORD = '071126';

  useEffect(() => {
    sessionStorage.setItem('menu_app_edit_authorized', String(editAuthorized));
  }, [editAuthorized]);

  // 优先从最新数据获取
  const dish = dishes.find(d => d.id === id) || getDish(id);

  if (!dish) {
    return (
      <div className="page">
        <div className="empty-state" style={{ paddingTop: 100 }}>
          <div className="empty-icon">❓</div>
          <p className="empty-text">菜品未找到</p>
          <button className="detail-action-btn" onClick={() => navigate(-1)}>返回</button>
        </div>
      </div>
    );
  }

  const isWant = dish.tags && dish.tags.includes('想吃');

  const handleWant = () => {
    const newTags = isWant
      ? dish.tags.filter(t => t !== '想吃')
      : [...(dish.tags || []), '想吃'];
    updateDish(id, { tags: newTags });
  };

  const requestAction = (action) => {
    // 编辑：仅需验证一次；删除：每次都验证
    if (action === 'edit' && editAuthorized) {
      navigate(`/edit/${id}`);
      return;
    }
    setPendingAction(action);
    setPassword('');
    setPasswordError('');
    setShowPasswordModal(true);
  };

  const handlePasswordConfirm = () => {
    if (password === ADMIN_PASSWORD) {
      setShowPasswordModal(false);
      if (pendingAction === 'edit') {
        setEditAuthorized(true);
        navigate(`/edit/${id}`);
      } else if (pendingAction === 'delete') {
        setShowDeleteConfirm(true);
      }
    } else {
      setPasswordError('密码错误，请重试');
    }
  };

  const handleDelete = () => {
    deleteDish(id);
    navigate(-1);
  };

  return (
    <div className="page">
      <header className="detail-header safe-area-top">
        <button className="header-back-btn" onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-text)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <span className="detail-header-title">{CATEGORY_NAMES[dish.category] || '菜品'}</span>
        <div style={{ width: 40 }} />
      </header>

      <div className="page-content-full detail-content">
        {dish.image ? (
          <div className="detail-hero-img">
            <img src={dish.image} alt={dish.name} />
          </div>
        ) : (
          <DefaultDetailImage category={dish.category} theme={theme} dishId={dish.id} />
        )}

        <div className="detail-body">
          <h1 className="detail-dish-name">{dish.name}</h1>

          {dish.tags && dish.tags.length > 0 && (
            <div className="detail-tags">
              {dish.tags.map(tag => (
                <span key={tag} className="detail-tag">{tag}</span>
              ))}
            </div>
          )}

          <CalorieEstimate recipe={dish.recipe} dishName={dish.name} />

          <div className="detail-recipe-section">
            <h2 className="detail-section-title">做法</h2>
            <div className="detail-recipe-text">
              {dish.recipe ? dish.recipe.split('\n').map((line, i) => (
                <p key={i} className={line.startsWith('做法') || line.startsWith('材料') ? 'recipe-header-line' : ''}>
                  {line}
                </p>
              )) : <p className="detail-recipe-empty">暂无做法记录</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="detail-actions safe-area-bottom">
        <button
          className={`detail-action-btn want-btn ${isWant ? 'active' : ''}`}
          onClick={handleWant}
        >
          {isWant ? '❤️ 已想吃' : '🤍 想吃'}
        </button>
        <button
          className="detail-action-btn primary"
          onClick={() => requestAction('edit')}
        >
          编辑
        </button>
        <button
          className="detail-action-btn danger"
          onClick={() => requestAction('delete')}
        >
          删除
        </button>
      </div>

      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-box animate-scale-in" onClick={e => e.stopPropagation()}>
            <p className="modal-title">🔒 管理员验证</p>
            <p className="modal-text">
              {pendingAction === 'edit' ? '编辑' : '删除'}需要输入管理员密码
              {pendingAction === 'edit' && !editAuthorized ? '（本会话仅需输入一次）' : ''}
            </p>
            <input
              type="password"
              className="modal-password-input"
              placeholder="请输入密码"
              value={password}
              onChange={e => { setPassword(e.target.value); setPasswordError(''); }}
              onKeyDown={e => e.key === 'Enter' && handlePasswordConfirm()}
              autoFocus
            />
            {passwordError && <p className="modal-error">{passwordError}</p>}
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setShowPasswordModal(false)}>取消</button>
              <button className="modal-btn confirm-pw" onClick={handlePasswordConfirm}>确认</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-box animate-scale-in" onClick={e => e.stopPropagation()}>
            <p className="modal-title">确认删除</p>
            <p className="modal-text">确定要删除「{dish.name}」吗？此操作不可恢复。</p>
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setShowDeleteConfirm(false)}>取消</button>
              <button className="modal-btn confirm" onClick={handleDelete}>删除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
