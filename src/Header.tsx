import type { CSSProperties, ReactNode } from 'react';
import React from 'react';

const Header = ({
  children,
  prefixCls = 'hlui-fullpage',
}: {
  children: ReactNode;
  prefixCls?: string;
}) => {
  const headerStyle: CSSProperties = {
    position: 'fixed',
    width: '100%',
    zIndex: 1,
    top: '0',
  };

  return (
    <header className={`${prefixCls}-header`} style={headerStyle}>
      {children}
    </header>
  );
};

export default Header;
