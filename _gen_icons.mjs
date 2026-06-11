import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = join(__dirname, 'src/assets/huangbai/3.jpg');
const pub = join(__dirname, 'public');

await sharp(src).resize(192, 192, { fit: 'cover' }).png().toFile(join(pub, 'icon-192.png'));
await sharp(src).resize(512, 512, { fit: 'cover' }).png().toFile(join(pub, 'icon-512.png'));
await sharp(src).resize(180, 180, { fit: 'cover' }).png().toFile(join(pub, 'apple-touch-icon.png'));
console.log('PWA icons generated!');
