import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import FullPage from '../src';

const { Section, Header, Footer } = FullPage;

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
  dots: false, // use dots navigatio
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

describe('Basic', () => {
  it('className props should work on component', () => {
    const className = 'hankliu-fullpage';
    const { container } = render(
      <FullPage {...Options} className={className}>
        {Items.map(item => (
          <Section
            id={item}
            className={item.replace(/(?!\b)([A-Z])/g, '-$1').toLowerCase()}
            key={item}
          >
            {<div key={item}>{item}</div>}
          </Section>
        ))}
      </FullPage>,
    );
    // @ts-ignore
    expect(container.firstChild).toHaveClass(className);
  });

  it('prefixCls props should work on component', () => {
    const prefixCls = 'hankliu-fullpage';
    const { container } = render(
      <FullPage {...Options} prefixCls={prefixCls}>
        {Items.map(item => (
          <Section
            id={item}
            className={item.replace(/(?!\b)([A-Z])/g, '-$1').toLowerCase()}
            key={item}
          >
            {<div key={item}>{item}</div>}
          </Section>
        ))}
      </FullPage>,
    );
    // @ts-ignore
    expect(container.firstChild).toHaveClass(prefixCls);
  });

  it('header and footer component should work on component', () => {
    const { container } = render(
      <>
        <Header>
          <a href="#sectionOne" className="opa">
            Section One
          </a>
        </Header>
        <Footer>
          <a href="" className="opa">
            Dcoumentation
          </a>
        </Footer>
        <FullPage {...Options} prefixCls="hlui-fullpage">
          {Items.map(item => (
            <Section
              id={item}
              className={item.replace(/(?!\b)([A-Z])/g, '-$1').toLowerCase()}
              key={item}
            >
              {<div key={item}>{item}</div>}
            </Section>
          ))}
        </FullPage>
      </>,
    );
    const headerDom = container.querySelector('.hlui-fullpage-header');
    const footerDom = container.querySelector('.hlui-fullpage-footer');
    expect(headerDom).not.toBeEmptyDOMElement();
    expect(footerDom).not.toBeEmptyDOMElement();

    expect(headerDom.textContent).toEqual('Section One');
    expect(footerDom.textContent).toEqual('Dcoumentation');
  });

  it('activeClass props should work on component', () => {
    const activeClass = 'hlui-fullpage-active';
    const { container } = render(
      <FullPage {...Options} activeClass={activeClass}>
        {Items.map(item => (
          <Section
            id={item}
            className={item.replace(/(?!\b)([A-Z])/g, '-$1').toLowerCase()}
            key={item}
          >
            {<div key={item}>{item}</div>}
          </Section>
        ))}
      </FullPage>,
    );

    const sectionDoms = container.querySelectorAll('.' + activeClass);
    expect(sectionDoms.length).toEqual(0);
  });

  it('dots props should work on component', () => {
    const { container } = render(
      <FullPage {...Options} dots>
        {Items.map(item => (
          <Section
            id={item}
            className={item.replace(/(?!\b)([A-Z])/g, '-$1').toLowerCase()}
            key={item}
          >
            {<div key={item}>{item}</div>}
          </Section>
        ))}
      </FullPage>,
    );

    const sectionDoms = container.querySelectorAll('.hlui-fullpage-dots');
    expect(sectionDoms.length).toEqual(1);
    expect(sectionDoms[0]).not.toBeEmptyDOMElement();
    expect(sectionDoms[0].getAttribute('style')).not.toEqual(null);
  });

  it('dots props should work on component', () => {
    const { container } = render(
      <FullPage {...Options} dots dotsClass="hlui-fullpage-dots-custom">
        {Items.map(item => (
          <Section
            id={item}
            className={item.replace(/(?!\b)([A-Z])/g, '-$1').toLowerCase()}
            key={item}
          >
            {<div key={item}>{item}</div>}
          </Section>
        ))}
      </FullPage>,
    );

    const sectionDoms = container.querySelectorAll('.hlui-fullpage-dots-custom');
    expect(sectionDoms.length).toEqual(1);
    expect(sectionDoms[0]).not.toBeEmptyDOMElement();
    expect(sectionDoms[0].getAttribute('style')).toEqual(null);
  });

  it('dotsAnchorClass props should work on component', () => {
    const { container } = render(
      <FullPage {...Options} dots dotsAnchorClass="hankliu-dotsAnchorClass">
        {Items.map(item => (
          <Section
            id={item}
            className={item.replace(/(?!\b)([A-Z])/g, '-$1').toLowerCase()}
            key={item}
          >
            {<div key={item}>{item}</div>}
          </Section>
        ))}
      </FullPage>,
    );

    const sectionDoms = container.querySelectorAll('.hankliu-dotsAnchorClass');
    expect(sectionDoms.length).toEqual(Items.length);
    expect(sectionDoms[0]).toBeVisible();
    expect(sectionDoms[0].getAttribute('style')).toEqual(null);
  });

  it('onScrolled props should work on component', () => {
    // 使用 jest.fn() 创建一个 Mock 函数
    const mockScrollHandler = jest.fn();

    const { container } = render(
      <FullPage {...Options} onScrolled={mockScrollHandler}>
        {Items.map(item => (
          <Section
            id={item}
            className={item.replace(/(?!\b)([A-Z])/g, '-$1').toLowerCase()}
            key={item}
          >
            {<div key={item}>{item}</div>}
          </Section>
        ))}
      </FullPage>,
    );

    // 使用 jest.useFakeTimers() 创建一个虚拟的时间环境
    jest.useFakeTimers();

    const scrollDiv = container.firstElementChild;

    // 模拟 wheel 事件
    fireEvent(scrollDiv, new WheelEvent('wheel', { detail: 1 }));

    mockScrollHandler();

    // 在这里，我们先推进时间
    jest.advanceTimersByTime(2000);

    expect(scrollDiv.getAttribute('class')).toEqual(
      'hlui-fullpage resume-properties-section-container',
    );

    // 断言回调函数被调用
    expect(mockScrollHandler).toHaveBeenCalled();

    // 恢复原来的时间环境
    jest.useRealTimers();
  });
});
