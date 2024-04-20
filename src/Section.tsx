import classNames from 'classnames';
import type { ReactNode } from 'react';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import SectionContext from './contexts';

interface ISectionProps {
  color?: string;
  className?: string;
  id?: string;
  verticalAlign?: boolean;
  children: ReactNode;
}

const Section = ({ color, children, verticalAlign, className, id }: ISectionProps) => {
  const [windowHeight, setWindowHeight] = useState<number>(0);

  // 使用 useContext 获取上下文的值
  const sectionContext = useContext(SectionContext);

  const handleResize = useCallback(() => {
    setWindowHeight(window.innerHeight);
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  const renderVerticalAlign = () => {
    const verticalAlignStyle = {
      display: 'table-cell',
      verticalAlign: 'middle',
      width: '100%',
    };

    return <div style={verticalAlignStyle}>{children}</div>;
  };

  const alignVertical = verticalAlign || sectionContext.verticalAlign;

  const sectionStyle = {
    width: '100%',
    display: alignVertical ? 'block' : 'table',
    height: windowHeight,
    maxHeight: windowHeight,
    overflow: 'auto',
    backgroundColor: color,
    paddingTop: sectionContext.sectionPaddingTop,
    paddingBottom: sectionContext.sectionPaddingBottom,
  };

  return (
    <div
      id={id}
      className={classNames(
        `${sectionContext.prefixCls}-section`,
        sectionContext.sectionClassName,
        {
          [className]: className,
        },
      )}
      style={sectionStyle}
    >
      {alignVertical ? children : renderVerticalAlign()}
    </div>
  );
};

export default Section;
