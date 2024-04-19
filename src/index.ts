import Footer from './Footer';
import InternalFullpage from './Fullpage';
import Header from './Header';
import Section from './Section';

export * from './Footer';
export * from './Fullpage';
export * from './Header';
export * from './Section';
export * from './utils';

type CompoundedComponent = typeof InternalFullpage & {
  Section: typeof Section;
  Header: typeof Header;
  Footer: typeof Footer;
};

const Fullpage = InternalFullpage as CompoundedComponent;
Fullpage.Section = Section;
Fullpage.Header = Header;
Fullpage.Footer = Footer;

export default Fullpage;
