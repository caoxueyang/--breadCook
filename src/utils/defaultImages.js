// 主题默认图片集中管理
// 用 Vite 的 ?url 后缀 + import.meta.glob 按文件名收集 URL
// 这样打包时不会内联图片数据，浏览器按需 fetch（结合 <img loading="lazy">）

// 菜品/酒品/甜品 图文件名清单（保持与原 POMP_IMAGES 顺序对齐，保证 hash 切换一致）
const DISH_FILES = [
  '12.jpg', '17.jpg', '18.jpg', '22.jpg', '55.webp', '61.jpg',
  '62.jpg', '63.jpg', '73.jpg', '76.jpg', '77.jpg', '85.webp',
];
const DRINK_FILES = [
  '11.jpg', '13.jpg', '15.jpg', '31.jpeg', '34.jpg', '65.jpg', '81.webp',
];
const DESSERT_FILES = [
  '2.webp', '3.jpg', '16.jpg', '5.jpg', '32.jpg', '51.webp', '64.jpg',
  'i1.jpg', 'i2.jpg', '71.jpg', '72.jpg', '78.jpg', '79.jpg', '80.png',
  '82.webp', '83.webp', '84.webp',
];

// 用 import.meta.glob 收集所有图片 URL（构建时只生成字符串，不内联数据）
const ALL_IMAGE_URLS = import.meta.glob(
  '../assets/huangbai/*.{jpg,jpeg,webp,png}',
  { eager: true, query: '?url', import: 'default' }
);

// 用文件 basename 索引 URL
const URL_BY_NAME = (() => {
  const map = {};
  for (const [path, url] of Object.entries(ALL_IMAGE_URLS)) {
    const filename = path.split('/').pop();
    map[filename] = url;
  }
  return map;
})();

// 特殊资源（用 ?url 显式获取，避免 Vite 解析为模块）
import back1Url from '../assets/huangbai/back1.jpeg?url';
import back2Url from '../assets/huangbai/back2.jpg?url';
import back3Url from '../assets/huangbai/back3.webp?url';
import back4Url from '../assets/huangbai/back4.jpg?url';
import kittyFaceUrl from '../assets/kitty/hello-kitty-face.svg?url';
import pompAvatarUrl from '../assets/huangbai/左上角.png?url';

export const TAB_BACKGROUNDS = {
  '/dishes': back4Url,
  '/drinks': back2Url,
  '/desserts': back3Url,
  '/favs': back1Url,
};

export const THEME_AVATARS = {
  pompompurin: pompAvatarUrl,
  hellokitty: kittyFaceUrl,
  minimal: null,
};

export const POMP_IMAGES = {
  dishes: DISH_FILES.map((f) => URL_BY_NAME[f]).filter(Boolean),
  drinks: DRINK_FILES.map((f) => URL_BY_NAME[f]).filter(Boolean),
  desserts: DESSERT_FILES.map((f) => URL_BY_NAME[f]).filter(Boolean),
};

/**
 * 根据分类 + dishId 稳定地选一张默认图（hash 取模算法保持向后兼容）
 * @param {string} category - dishes | drinks | desserts
 * @param {string} id - 菜品 id
 * @returns {string|null} 图片 URL，没有则 null
 */
export function getPompImage(category, id) {
  const imgs = POMP_IMAGES[category] || POMP_IMAGES.dishes;
  if (!imgs || imgs.length === 0) return null;
  const idx = (id || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0) % imgs.length;
  return imgs[idx];
}

export { kittyFaceUrl, pompAvatarUrl };
