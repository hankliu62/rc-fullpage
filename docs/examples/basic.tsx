import FullPage from '@hankliu/rc-fullpage';
import * as React from 'react';
import styled from 'styled-components';

import './basic.css';

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

  const Colors = ['#fcba85', '#e1105e', '#e6f952', '#23d2a6', '#4414bf', '#2899aa'];

  const renderResumeItem = (item, index) => {
    const ResumeIndex = styled.div`
      background-color: ${Colors[index]};
      mix-blend-mode: difference;
      display: flex;
      justify-content: center;
      align-items: start;
      height: 100vh;
      padding-top: 20px;
      box-sizing: border-box;
    `;
    return <ResumeIndex key={item}>{item}</ResumeIndex>;
  };

  const OutDiv = styled.div`
    height: 100px;
    border: 1px solid #ddd;
    border-radius: 2px;
    overflow-y: hidden;
  `;

  const onFullScreen = () => {
    document.querySelector('.hlui-fullpage').requestFullscreen();
  };

  React.useEffect(() => {
    function reset() {
      document.querySelector('body')!.style.overflow = 'auto';
      setTimeout(() => {
        reset();
      }, 300);
    }

    reset();
  }, []);

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
