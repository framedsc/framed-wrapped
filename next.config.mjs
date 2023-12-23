/**
* @type {import('next').NextConfig}
*/
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  images: {
    loader: 'akamai',
    path: '',
  },
  assetPrefix: './',
  sassOptions: {
    includePaths: [path.join(__dirname, "styles"), path.join(__dirname, "public\fonts")],
  },
};

export default nextConfig;