var nav = require('./nav.js');
var {Websites, Articles, ComponentNav} = nav;

var utils = require('./utils.js');
var {genNav, getComponentSidebar, deepClone} = utils;

module.exports = {
  title: "keyon's Blog",
  description: "keyon's Blog",
  base: '/', // 网站基本页面
  dest: './dist', // 项目打包后的文件夹位置
  themeConfig: {
    // 设置导航栏的图标
    logo: '/assets/img/favicon-32x32.png',
    // 设置多语言
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        editLinkText: 'Edit this page on GitHub',
        nav: [
          {
            text: 'Essays',
            link: '/essays/',
          },
          {
            text: 'Articles',
            items: genNav(deepClone(Articles), 'EN'),
          },
          {
            text: 'Websites',
            items: genNav(deepClone(Websites), 'EN'),
          },
          {
            text: 'ChineseWebsite(gitee)',
            link: 'https://gitee.com/ou-jiarong/keyon-s-blog', // 如果link内容是网站地址，导航栏右上角会显示一个小箭头
          },
        ],
        sidebar: {
          '/articles/': [
            {
              title: 'Font-end',
              collapsable: false,
              children: genFontEndSidebar(),
            },
            {
              title: 'Back-end',
              collapsable: false,
              children: genBackEndSidebar(),
            },
          ],
          '/essays/': [
            {
              title: 'Essays',
              collapsable: false,
              children: genEssaysSidebar(),
            },
          ],
          // '/feature/component/': getComponentSidebar(deepClone(ComponentNav), 'EN'),
        },
      },
      '/zh/': {
        label: '简体中文',
        selectText: '选择语言',
        editLinkText: '在 GitHub 上编辑此页',
        nav: [
          {
            text: '我的随笔',
            link: '/zh/essays/',
          },
          {
            text: '我的文章',
            items: genNav(deepClone(Articles), 'ZH'),
          },
          {
            text: '我的网站',
            items: genNav(deepClone(Websites), 'ZH'),
          },
          {
            text: '中文站点(gitee)',
            link: 'https://gitee.com/ou-jiarong/keyon-s-blog',
          },
        ],
        // 注意加上相应的前缀
        sidebar: {
          '/zh/articles/': [
            {
              title: '前端',
              collapsable: false,
              children: genFontEndSidebar('/zh'),
            },
            {
              title: '后端',
              collapsable: false,
              children: genBackEndSidebar('/zh'),
            },
          ],
          '/zh/essays/': [
            {
              title: '我的随笔',
              collapsable: false,
              children: genEssaysSidebar('/zh'),
            },
          ],
          // '/zh/feature/component/': getComponentSidebar(deepClone(ComponentNav), 'ZH'),
        },
      },
    },
    editLinks: false,
    docsDir: 'docs',
    // sidebar: []
    sidebarDepth: 3, // 侧边栏显示深度，默认1，最大3（显示到h3标题）
  },
  locales: {
    '/': {
      lang: 'en-US',
      description: "keyon's Blog",
    },
    '/zh/': {
      lang: 'zh-CN',
      description: '悟空的博客',
    },
  },
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: '/favicon.ico',
      },
    ],
  ],
  configureWebpack: {
    resolve: {
      alias: {
        '@public': './public',
      },
    },
  },
};

// 生成随笔文章侧边导航
function genEssaysSidebar(type = '') {
  const mapArr = ['/essays/', '/essays/errorCapture.md', '/essays/npmLibrary.md', '/essays/JsSourceCode.md'];
  return mapArr.map(i => {
    return type + i;
  });
}

// 生成前端文章侧边导航
function genFontEndSidebar(type = '') {
  const mapArr = [
    '/articles/font-end/cssModules.md',
    '/articles/font-end/htmlModules.md',
    '/articles/font-end/javascriptModules.md',
    '/articles/font-end/vueModules.md',
    '/articles/font-end/reactModules.md',
  ];
  return mapArr.map(i => {
    return type + i;
  });
}

// 生成后端文章侧边导航
function genBackEndSidebar(type = '') {
  const mapArr = ['/articles/back-end/nodeModules.md'];
  return mapArr.map(i => {
    return type + i;
  });
}
