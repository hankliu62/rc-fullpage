# @hankliu/rc-fullpage

[![NPM version][npm-image]][npm-url] [![npm download][download-image]][download-url] [![build status][github-actions-image]][github-actions-url] [![Codecov][codecov-image]][codecov-url] [![bundle size][bundlephobia-image]][bundlephobia-url] [![dumi][dumi-image]][dumi-url]

[npm-image]: http://img.shields.io/npm/v/rc-fullpage.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@hankliu/rc-fullpage
[travis-image]: https://img.shields.io/travis/hankliu62/rc-fullpage/master?style=flat-square
[github-actions-image]: https://github.com/hankliu62/rc-fullpage/workflows/CI/badge.svg
[github-actions-url]: https://github.com/hankliu62/rc-fullpage/actions
[codecov-image]: https://img.shields.io/codecov/c/github/hankliu62/rc-fullpage/master.svg?style=flat-square
[codecov-url]: https://app.codecov.io/gh/hankliu62/rc-fullpage
[download-image]: https://img.shields.io/npm/dm/@hankliu/rc-fullpage.svg?style=flat-square
[download-url]: https://npmjs.org/package/@hankliu/rc-fullpage
[bundlephobia-url]: https://bundlephobia.com/package/@hankliu/rc-fullpage
[bundlephobia-image]: https://badgen.net/bundlephobia/minzip/@hankliu/rc-fullpage
[dumi-url]: https://github.com/umijs/dumi
[dumi-image]: https://img.shields.io/badge/docs%20by-dumi-blue?style=flat-square

一个类似[fullpage.js](https://github.com/alvarotrigo/fullPage.js)的 `React` 实现的组件，支持全屏滚动。

## 功能特征

- [x] 全屏滚动 `React UI` 组件

## 安装

```bash
npm install @hankliu/rc-fullpage --save
```

or

```bash
yarn add @hankliu/rc-fullpage
```

or

```bash
pnpm install @hankliu/rc-fullpage
```

## 使用

```bash
npm install
npm start
```

```jsx
import FullPage from '@hankliu/rc-fullpage';
import * as React from 'react';
import styled from 'styled-components';

export default function Base() {
  const Options = {
    activeClass: 'active', // the class that is appended to the sections links
    anchors: [
      'resume-index',
      'resume-introduction',
      'resume-skill',
      'resume-experience',
      'resume-project',
      'resume-article',
    ], // the anchors for each sections
    shortcutKey: true, // use arrow keys
    className: 'resume-properties-section-container', // the class name for the section container
    delay: 1000, // the scroll animation speed
    dots: true, // use dots navigatio
    scrollBar: false, // use the browser default scrollbar
    sectionClassName: 'resume-properties-section resume-section-container', // the section class name
    sectionPaddingTop: '0', // the section top padding
    sectionPaddingBottom: '0', // the section bottom padding
    verticalAlign: false, // align the content of each section vertical
    touchable: true,
  };

  const Items = [
    'ResumeIndex',
    'ResumeIntroduction',
    'ResumeSkill',
    'ResumeExperience',
    'ResumeProject',
    'ResumeArticle',
  ];

  const Colors = ['#fcba85', '#e1105e', '#e6f952', '#23d2a6', '#4414bf', '#2899aa'];

  const renderResumeItem = (item, index) => {
    const ResumeIndex = styled.div`
      background-color: ${Colors[index]};
      mix-blend-mode: difference;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      box-sizing: border-box;
    `;
    return <ResumeIndex key={item}>{item}</ResumeIndex>;
  };

  const OutDiv = styled.div`
    height: 100vh;
    border: 1px solid #ddd;
    border-radius: 2px;
    overflow-y: hidden;
  `;

  React.useEffect(() => {
    function reset() {
      if (document.querySelector('body')!.style.overflow === 'hidden') {
        document.querySelector('body')!.style.overflow = 'auto';
      }
      setTimeout(() => {
        reset();
      }, 300);
    }

    reset();
  }, []);

  const onFullScreen = () => {
    document.querySelector('.hlui-fullpage').requestFullscreen();
  };

  return (
    <>
      <div>{Items.join(' > ')}</div>
      <OutDiv>
        <FullPage {...Options}>
          {Items.map((item, index) => (
            <FullPage.Section
              id={item}
              className={item.replace(/(?!\b)([A-Z])/g, '-$1').toLowerCase()}
              key={item}
            >
              {renderResumeItem(item, index)}
            </FullPage.Section>
          ))}
        </FullPage>
      </OutDiv>
      <button style={{ marginTop: '10px' }} onClick={onFullScreen}>
        全屏
      </button>
    </>
  );
}
```

## API 参数

| 名称 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| className | string | - | 组件外层元素 classname |
| prefixCls | string | hlui-fullpage | 组件外层元素 classname 前缀 |
| delay | number | 1000 | 持续动画时间(ms) |
| verticalAlign | boolean | true | 是否为垂直方向全屏滚动 |
| scrollBar | boolean | false | 是否使用浏览器默认滚动条 |
| dots | boolean | true | 是否显示面板指示点 |
| sectionClassName | string | hlui-fullpage-section | 组件 Section 元素 classname |
| anchors | string[] | - | 对应 section 列表元素的锚点名称列表 |
| activeClass | string | active | 当前正在显示的 Section 的 classname |
| sectionPaddingTop | string \| number | 0 | Section 元素的上边距 |
| sectionPaddingBottom | string \| number | 0 | Section 元素的下边距 |
| shortcutKey | boolean | true | 是否支持箭头快捷键 |
| touchable | boolean | true | 是否支持 Touch 事件 |
| activeSection | number | 0 | 默认显示的 Section 索引 |
| dotsAnchorClass | string | - | 面板指示点中锚点的 classname |
| dotsClass | string | - | 面板指示点的 classname |

## 案例

`npm start` 然后打开 http://localhost:8000/examples/

线上案例: https://hankliu62.github.io/rc-fullpage

## 单元测试

```
npm test
```

## 覆盖率

```
npm run coverage
```

## License

@hankliu/rc-fullpage is released under the MIT license.
