import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { useTheme } from '../contexts/ThemeContext';
import { getDish } from '../utils/storage';
import { getPompImage, kittyFaceUrl as kittyFace } from '../utils/defaultImages';
import CalorieEstimate from '../components/CalorieEstimate';
import { parseRecipeIngredients, RISK_LABELS, RISK_COLORS } from '../data/pesticideRisk';
import './DishDetail.css';
import './Page.css';

const CATEGORY_NAMES = { dishes: '菜品', drinks: '酒品', desserts: '甜品' };

function DefaultDetailImage({ category, theme, dishId }) {
  if (theme === 'pompompurin') {
    const src = getPompImage(category, dishId);
    if (!src) {
      return (
        <div className="detail-default-img minimal-detail-bg">
          <span>◇</span>
        </div>
      );
    }
    return (
      <div className="detail-default-img">
        <img src={src} alt="默认图" loading="lazy" decoding="async" />
      </div>
    );
  }
  // HelloKitty主题
  if (theme === 'hellokitty') {
    return (
      <div className="detail-default-img kitty-detail-bg">
        <img src={kittyFace} alt="Hello Kitty" className="kitty-face-lg" loading="lazy" decoding="async" />
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
            <img src={dish.image} alt={dish.name} loading="lazy" decoding="async" />
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

          <CalorieEstimate recipe={dish.recipe} servings={dish.servings} dishName={dish.name} />

          <div className="detail-recipe-section">
            <h2 className="detail-section-title">做法</h2>
            {(() => {
              if (!dish.recipe) {
                return <p className="detail-recipe-empty">暂无做法记录</p>;
              }
              const lines = dish.recipe.split('\n');
              const ingredients = parseRecipeIngredients(dish.recipe);
              // 定位 "材料" 行的下标集合（同一行可能多行描述）
              const matLineIdx = lines.findIndex(l => /^材料[：:]/.test(l));
              return (
                <>
                  {ingredients.length > 0 && (
                    <div className="ingredients-flow">
                      {ingredients.map((ing, i) => {
                        const colors = ing.risk ? RISK_COLORS[ing.risk] : null;
                        return (
                          <span
                            key={i}
                            className={`ingredient-token${ing.risk ? ' has-risk' : ''}`}
                            style={ing.risk ? {
                              '--risk-bg': colors.bg,
                              '--risk-border': colors.border,
                              '--risk-text': colors.text
                            } : undefined}
                            title={ing.risk ? `${RISK_LABELS[ing.risk].label} · ${RISK_LABELS[ing.risk].desc}` : undefined}
                          >
                            {ing.raw}
                            {ing.risk && (
                              <span
                                className="risk-dot"
                                style={{ backgroundColor: colors.text }}
                              />
                            )}
                          </span>
                        );
                      })}
                    </div>
                  )}
                  <div className="detail-recipe-text">
                    {lines.map((line, i) => {
                      // 跳过 "材料" 那行（已渲染为 ingredient-token）
                      if (i === matLineIdx) return null;
                      return (
                        <p key={i} className={line.startsWith('做法') || line.startsWith('材料') ? 'recipe-header-line' : ''}>
                          {line}
                        </p>
                      );
                    })}
                  </div>
                </>
              );
            })()}
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
