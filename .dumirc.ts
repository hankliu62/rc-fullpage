import { defineConfig } from 'dumi';
import path from 'path';

const config: ReturnType<typeof defineConfig> = {
  alias: {
    '@hankliu/rc-fullpage': path.resolve('src'),
    '@hankliu/rc-fullpage/es': path.resolve('src'),
  },
  favicons: ['https://hankliu62.github.io/frontend/favicon.ico'],
  themeConfig: {
    name: 'Image',
    logo: 'https://hankliu62.github.io/frontend/favicon.ico',
  },
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      {
        libraryName: '@hankliu/hankliu-ui',
        libraryDirectory: 'lib',
        style: true,
      },
    ],
  ],
};

// 是否通过github actions部署
const isGithubActions = process.env.GITHUB_ACTIONS || false;

if (isGithubActions) {
  // @ts-ignore
  const repo = process.env.GITHUB_REPOSITORY.replace(/.*?\//, '');
  // 用于为静态资源（如图像、样式表、JavaScript 文件等）设置 URL 前缀
  // 这在将应用部署到自定义域名或 CDN 上时特别有用，因为它允许您将静态资源存储在不同的位置
  config.base = `/${repo}/`;
  // 用于为应用设置基础路径(Link组件中，类似 history 里面的basename，在路由跳转时自动加前缀)
  // 这在将应用部署到子目录下时特别有用，因为它允许您指定应用所在的目录
  config.publicPath = `/${repo}/`;

  console.log('next config is:', config);
}

export default defineConfig(config);
