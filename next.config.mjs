/** @type {import('next').NextConfig} */
const nextConfig = {
  // 模板/画廊图都是本地静态 jpg，直接 <img> 输出，不依赖图片优化器，部署更简单。
  images: { unoptimized: true },
};

export default nextConfig;
