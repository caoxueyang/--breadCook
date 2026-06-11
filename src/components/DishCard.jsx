import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useData } from '../contexts/DataContext';
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
import './DishCard.css';

const CATEGORY_EMOJI = {
  dishes: '🍳',
  drinks: '🍹',
  desserts: '🍰',
};

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

function DefaultImage({ category, theme, dishId }) {
  // 布丁狗主题: 使用实际图片（按分类轮换）
  if (theme === 'pompompurin') {
    const src = getPompImage(category, dishId);
    return (
      <div className="dish-card-default-img">
        <img src={src} alt="默认图" />
      </div>
    );
  }
  // HelloKitty主题: Kitty头像 + 粉色
  if (theme === 'hellokitty') {
    return (
      <div className="dish-card-default-img kitty-bg">
        <img src={kittyFace} alt="Hello Kitty" className="kitty-face" />
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
          <img src={dish.image} alt={dish.name} />
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
