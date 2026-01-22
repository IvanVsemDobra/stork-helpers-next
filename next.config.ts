import type { NextConfig } from "next";

const repoName = '/stork-helpers-next'; // назва репозиторію на GitHub

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: 'export',            // щоб next export створював статичну версію
  basePath: repoName,          // додаємо базовий шлях для GitHub Pages
  assetPrefix: repoName + '/', // щоб статика підтягулась правильно
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ftp.goit.study',
      },
    ],
  },
  // rewrites не працюють з output: 'export', треба видалити для деплою на GitHub Pages
};

export default nextConfig;