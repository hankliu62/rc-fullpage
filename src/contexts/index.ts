import { createContext } from 'react';

// 创FullPage上下文
const SectionContext = createContext<{
  verticalAlign: boolean;
  sectionClassName: string;
  sectionPaddingTop: string | number;
  sectionPaddingBottom: string | number;
  prefixCls: string;
}>({
  verticalAlign: false,
  sectionClassName: 'Section',
  sectionPaddingTop: '0',
  sectionPaddingBottom: '0',
  prefixCls: '',
});

export default SectionContext;
