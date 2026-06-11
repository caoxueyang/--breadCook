import './TagFilter.css';

const COMMON = ['全部', '包包的最爱', '我的最爱'];
const CATEGORY_TAGS = {
  dishes: [...COMMON, '应季菜', '东北菜', '白人饭'],
  drinks: [...COMMON, '饮料', '酒'],
  desserts: [...COMMON, '甜品'],
};
const DEFAULT_TAGS = [...COMMON, '应季菜', '东北菜', '白人饭', '酒', '甜品'];

export default function TagFilter({ activeTag, onTagChange, category }) {
  const tags = category ? (CATEGORY_TAGS[category] || DEFAULT_TAGS) : DEFAULT_TAGS;

  return (
    <div className="tag-filter">
      <div className="tag-filter-scroll">
        {tags.map(tag => {
          const isActive = (tag === '全部' && !activeTag) || activeTag === tag;
          return (
            <button
              key={tag}
              className={`tag-filter-item ${isActive ? 'active' : ''}`}
              onClick={() => onTagChange(tag === '全部' ? '' : tag)}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}
