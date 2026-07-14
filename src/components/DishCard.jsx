import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';
import { getPompImage, kittyFaceUrl as kittyFace } from '../utils/defaultImages';
import './DishCard.css';

const CATEGORY_EMOJI = {
  dishes: '🍳',
  drinks: '🍹',
  desserts: '🍰',
};

function DefaultImage({ category, theme, dishId }) {
  // 布丁狗主题: 使用实际图片（按分类轮换）
  if (theme === 'pompompurin') {
    const src = getPompImage(category, dishId);
    if (!src) {
      return (
        <div className="dish-card-default-img minimal-bg">
          <span>{CATEGORY_EMOJI[category] || '🍽️'}</span>
        </div>
      );
    }
    return (
      <div className="dish-card-default-img">
        <img src={src} alt="默认图" loading="lazy" decoding="async" />
      </div>
    );
  }
  // HelloKitty主题: Kitty头像 + 粉色
  if (theme === 'hellokitty') {
    return (
      <div className="dish-card-default-img kitty-bg">
        <img src={kittyFace} alt="Hello Kitty" className="kitty-face" loading="lazy" decoding="async" />
      </div>
    );
  }
  // 极简主题
  return (
    <div className="dish-card-default-img minimal-bg">
      <span>{CATEGORY_EMOJI[category] || '🍽️'}</span>
    </div>
  );
}

export default function DishCard({ dish, hideQuickAdd = false }) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { updateDish } = useData();

  const isWant = dish.tags && dish.tags.includes('想吃');

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const tags = dish.tags || [];
    if (isWant) return;
    updateDish(dish.id, { tags: [...tags, '想吃'] });
  };

  return (
    <div
      className={`dish-card animate-fade-in theme-${theme}`}
      onClick={() => navigate(`/dish/${dish.id}`)}
    >
      {dish.image ? (
        <div className="dish-card-img">
          <img src={dish.image} alt={dish.name} loading="lazy" decoding="async" />
        </div>
      ) : (
        <DefaultImage category={dish.category} theme={theme} dishId={dish.id} />
      )}
      <div className="dish-card-info">
        <div className="dish-card-name">
          <span className="dish-card-emoji">{CATEGORY_EMOJI[dish.category]}</span>
          {dish.name}
        </div>
        {dish.tags && dish.tags.length > 0 && (
          <div className="dish-card-tags">
            {dish.tags.slice(0, 3).map(tag => (
              <span key={tag} className="dish-card-tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
      {!hideQuickAdd && (
        <button
          className={`dish-card-quick-add ${isWant ? 'added' : ''}`}
          onClick={handleQuickAdd}
          title={isWant ? '已加入' : '加入已选'}
        >
          {isWant ? '✓' : '+'}
        </button>
      )}
    </div>
  );
}
