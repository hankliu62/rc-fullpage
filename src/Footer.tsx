import type { CSSProperties, ReactNode } from 'react';
import React from 'react';

const Footer = ({
  children,
  prefixCls = 'hlui-fullpage',
}: {
  children: ReactNode;
  prefixCls?: string;
}) => {
  const footerStyle: CSSProperties = {
    position: 'fixed',
    width: '100%',
    zIndex: 1,
    bottom: '0',
  };

  return (
    <footer className={`${prefixCls}-footer`} style={footerStyle}>
      {children}
    </footer>
  );
};

export default Footer;
