/* eslint-disable @babel/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import classNames from 'classnames';
import throttle from 'lodash.throttle';
import type { CSSProperties, ReactNode } from 'react';
import React, {
  Children,
  cloneElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import SectionContext from './contexts';

type TOnScrolledParams = {
  activeSection: number;
  scrollingStarted: boolean;
  sectionScrolledPosition: number;
};

interface ISectionsContainerProps {
  onScrolled?: (params: TOnScrolledParams) => void;
  delay?: number;
  verticalAlign?: boolean;
  scrollBar?: boolean;
  dots?: boolean;
  prefixCls?: string;
  className?: string;
  sectionClassName?: string;
  dotsClass?: string;
  dotsAnchorClass?: string;
  activeClass?: string;
  sectionPaddingTop?: string | number;
  sectionPaddingBottom?: string | number;
  shortcutKey?: boolean;
  activeSection?: number;
  touchable?: boolean;
  anchors?: string[];
  children?: ReactNode;
}

const SectionsContainer = ({
  onScrolled = undefined,
  delay = 1000,
  verticalAlign = true,
  scrollBar = false,
  dots = true,
  prefixCls = 'hlui-fullpage',
  className,
  sectionClassName = 'hlui-fullpage-section',
  anchors = [],
  activeClass = 'active',
  sectionPaddingTop = '0',
  sectionPaddingBottom = '0',
  shortcutKey = true,
  activeSection = 0,
  touchable = true,
  children,
  dotsAnchorClass,
  dotsClass,
}: ISectionsContainerProps) => {
  // 当前激活显示的 Section 索引
  const [stateActiveSection, setStateActiveSection] = useState<number>(activeSection);
  // 需要在副作用函数里面使用，stateActiveSection 是批量更新的，使用当前变量可以获得最新的激活显示的 Section 索引
  const stateActiveSectionRef = useRef<number>(stateActiveSection);
  // 容器元素
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 滚轮正在滚动标识
  const scrollingStartedRef = useRef<boolean>(false);
  // 滚动的距离
  const [sectionScrolledPosition, setSectionScrolledPosition] = useState<number>(0);
  // 滚动的距离
  const sectionScrolledPositionRef = useRef<number>(0);

  // 全屏滚动回调函数参数
  const scrolledParams = useMemo<TOnScrolledParams>(
    () => ({
      activeSection: stateActiveSection,
      scrollingStarted: scrollingStartedRef.current,
      sectionScrolledPosition: sectionScrolledPositionRef.current,
    }),
    [stateActiveSection],
  );

  // 当前激活的 Section 索引发生改变就会触发对应的回调函数
  const handleScrollCallback = useCallback(() => {
    if (onScrolled) {
      setTimeout(() => onScrolled(scrolledParams), 0);
    }
  }, [onScrolled, scrolledParams]);

  // 重制滚动标识(scrollingStartedRef)的定时器
  const resetScrollTimer = useRef<number>();
  // 子元素 Section 的个数
  const childrenLength = useRef<number>(children ? (children as any).length : 0);

  // 传入 Section 中的值
  const contextData = useMemo(() => {
    return {
      verticalAlign: verticalAlign,
      sectionClassName: sectionClassName,
      sectionPaddingTop: sectionPaddingTop,
      sectionPaddingBottom: sectionPaddingBottom,
      prefixCls,
    };
  }, [verticalAlign, sectionClassName, sectionPaddingTop, sectionPaddingBottom, prefixCls]);

  // 复制子元素，添加锚点ID
  const addChildrenWithAnchorId = useCallback(() => {
    let index = 0;

    return Children.map(children, child => {
      const id = anchors[index];

      index++;

      return id
        ? cloneElement(child as any, {
            id: id,
          })
        : child;
    });
  }, [anchors, children]);

  // 禁止页面滚动
  const addOverflowToBody = useCallback(() => {
    document.querySelector('body')!.style.overflow = 'hidden';
  }, []);

  // 解除禁止页面滚动
  const removeOverflowFromBody = useCallback(() => {
    document.querySelector('body')!.style.overflow = 'initial';
  }, []);

  // 清除重制滚动标识(scrollingStartedRef)的定时器
  const clearResetScrollTimer = useCallback(() => {
    if (resetScrollTimer.current) {
      clearTimeout(resetScrollTimer.current);
    }
  }, []);

  // 重制滚动标识
  const resetScroll = useCallback(() => {
    clearResetScrollTimer();

    // 重制滚动标识(scrollingStartedRef)的定时器
    resetScrollTimer.current = setTimeout(() => {
      scrollingStartedRef.current = false;
      // 在动画之后，再延迟300ms
    }, delay + 300) as unknown as number;
  }, [clearResetScrollTimer, delay]);

  // 锚点链接添加当前机会的className
  const addActiveClass = useCallback(() => {
    // 先移除 Active className
    const activeLinks = document.querySelectorAll(
      `a:not([href="#${anchors[stateActiveSectionRef.current]}"])`,
    );

    if (activeLinks) {
      for (const activeLink of activeLinks) {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const className = activeLink.className
          .replaceAll(activeClass, '')
          .replaceAll(/\s+/g, ' ')
          .trim();

        activeLink.className = `${className} ${activeClass}`.trim();
      }
    }
  }, [activeClass, anchors]);

  // 设置当前显示的 Section 索引，修改URL中的hash值，设置Section需要偏移的距离
  const setAnchorAndSectionTransition = useCallback(
    (index: number) => {
      if (anchors.length === 0 || index === -1 || index >= anchors.length) {
        return false;
      }

      // 设置Hash
      const hash = anchors[index];
      const nextHash = '#' + hash;
      if (window.location.hash !== nextHash) {
        window.location.hash = '#' + hash;
      }

      // 设置translate偏移量和当前选中的Section
      const position = 0 - index * window.innerHeight;

      scrollingStartedRef.current = true;
      setStateActiveSection(index);
      stateActiveSectionRef.current = index;
      setSectionScrolledPosition(position);
      sectionScrolledPositionRef.current = position;

      resetScroll();
      handleScrollCallback();

      // 修改当前选中的Section时，添加对应的active class
      addActiveClass();
    },
    [anchors, addActiveClass, handleScrollCallback, resetScroll],
  );

  // hash发生改变时，修改当前显示的 Section 索引，设置Section需要偏移的距离
  const handleHashChange = useCallback(() => {
    const hash = window.location.hash.slice(1);
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const activeSection = anchors.indexOf(hash);

    if (stateActiveSectionRef.current !== activeSection) {
      setAnchorAndSectionTransition(activeSection);
    }
  }, [anchors, setAnchorAndSectionTransition]);

  // 窗口大小改变时，修改当前显示的 Section 索引，修改URL中的hash值，设置Section需要偏移的距离
  const handleResize = useCallback(() => {
    const position = 0 - stateActiveSectionRef.current * window.innerHeight;

    scrollingStartedRef.current = true;
    setSectionScrolledPosition(position);
    sectionScrolledPositionRef.current = position;

    resetScroll();
  }, [resetScroll]);

  // 监听快捷键触发时，修改当前显示的 Section 索引，修改URL中的hash值，设置Section需要偏移的距离
  const handleShortcutKeys = useCallback(
    (e: any) => {
      const event = window.event || e;
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const activeSection =
        event.keyCode === 38 || event.keyCode === 37
          ? stateActiveSectionRef.current - 1
          : event.keyCode === 40 || event.keyCode === 39
          ? stateActiveSectionRef.current + 1
          : -1;

      if (
        scrollingStartedRef.current ||
        activeSection < 0 ||
        childrenLength.current === activeSection
      ) {
        return false;
      }

      setAnchorAndSectionTransition(activeSection);
    },
    [setAnchorAndSectionTransition],
  );

  // 处理滚轮事件的滚动
  const handleMouseWheel = useCallback(
    throttle((event: any) => {
      const e = window.event || event;
      const delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const activeSection = stateActiveSectionRef.current - delta;

      if (
        scrollingStartedRef.current ||
        activeSection < 0 ||
        childrenLength.current === activeSection
      ) {
        return false;
      }

      setAnchorAndSectionTransition(activeSection);
    }, 100),
    [setAnchorAndSectionTransition],
  );

  // 处理wheel事件
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.addEventListener('wheel', handleMouseWheel, false);
      containerRef.current.addEventListener('mousewheel', handleMouseWheel, false);
      containerRef.current.addEventListener('DOMMouseScroll', handleMouseWheel, false);
    }
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('wheel', handleMouseWheel);
        containerRef.current.removeEventListener('mousewheel', handleMouseWheel);
        containerRef.current.removeEventListener('DOMMouseScroll', handleMouseWheel);
      }
    };
  }, [handleMouseWheel]);

  // 处理Touch事件
  const handleTouchNav = useCallback(() => {
    const container = document.querySelector('.' + className);
    let swipedir: string;
    let startX: number;
    let startY: number;
    let distX: number;
    let distY: number;
    const threshold = 50;
    const restraint = 100;
    const allowedTime = 1000;
    let elapsedTime: number;
    let startTime: number;

    const handleswipe = function (swipeDir: string) {
      console.log(swipeDir);
    };

    // 处理 Touch 开始事件
    const handleTouchNavStart = (e: any) => {
      if (scrollingStartedRef.current) {
        return;
      }
      const touchobj = e.changedTouches[0];
      swipedir = 'none';
      startX = touchobj.pageX;
      startY = touchobj.pageY;
      startTime = Date.now();
    };

    // 处理 Touch 进行中事件
    const handleTouchNavMove = (e: any) => {
      if (scrollingStartedRef.current) {
        return;
      }

      e.preventDefault();
    };

    // 处理 Touch 结束事件
    const handleTouchNavEnd = (e: any) => {
      if (scrollingStartedRef.current) {
        return;
      }

      const touchobj = e.changedTouches[0];
      distX = touchobj.pageX - startX;
      distY = touchobj.pageY - startY;
      elapsedTime = Date.now() - startTime;

      if (
        elapsedTime <= allowedTime &&
        Math.abs(distY) >= threshold &&
        Math.abs(distX) <= restraint
      ) {
        swipedir = distY < 0 ? 'up' : 'down';
        const direction = stateActiveSectionRef.current + 1 * (swipedir === 'down' ? -1 : 1);
        setAnchorAndSectionTransition(direction);
      }
      handleswipe(swipedir);
    };

    if (container) {
      container.addEventListener('touchstart', handleTouchNavStart, false);
      container.addEventListener('touchmove', handleTouchNavMove, false);
      container.addEventListener('touchend', handleTouchNavEnd, false);
    }

    return () => {
      if (container) {
        container.removeEventListener('touchstart', handleTouchNavStart);
        container.removeEventListener('touchmove', handleTouchNavMove);
        container.removeEventListener('touchend', handleTouchNavEnd);
      }
    };
  }, [className, setAnchorAndSectionTransition]);

  useEffect(() => {
    clearResetScrollTimer();
    removeOverflowFromBody();

    handleResize();
    window.addEventListener('resize', handleResize);

    if (!scrollBar) {
      addOverflowToBody();
      // 初始化时，监听 hash 的值
      handleHashChange();

      window.addEventListener('hashchange', handleHashChange, false);

      // 支持快捷键
      if (shortcutKey) {
        window.addEventListener('keydown', handleShortcutKeys);
      }

      // 支持touch事件
      if (touchable) {
        handleTouchNav();
      }
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('hashchange', handleHashChange);

      if (shortcutKey) {
        window.removeEventListener('keydown', handleShortcutKeys);
      }
    };
  }, []);

  // 显示面板指示点
  const renderDots = () => {
    const dotsStyle: CSSProperties = {
      position: 'fixed',
      zIndex: '10',
      right: '20px',
      top: '50%',
      transform: 'translate(-50%, -50%)',
    };

    const anchorElements = anchors.map((link: string, index: number) => {
      const anchorStyle: CSSProperties = {
        display: 'block',
        margin: '10px',
        borderRadius: '100%',
        backgroundColor: '#556270',
        padding: '5px',
        transition: 'all 0.2s',
        transform: stateActiveSection === index ? 'scale(1.3)' : 'none',
      };

      return (
        <a
          href={`#${link}`}
          key={link}
          className={classNames(dotsAnchorClass, `${prefixCls}-dots-anchor`)}
          style={dotsAnchorClass ? {} : anchorStyle}
        />
      );
    });

    return (
      <div
        className={classNames(dotsClass, `${prefixCls}-dots`)}
        style={dotsClass ? {} : dotsStyle}
      >
        {anchorElements}
      </div>
    );
  };

  const containerStyle: CSSProperties = {
    height: '100%',
    width: '100%',
    position: 'relative',
    transform: `translate3d(0px, ${sectionScrolledPosition}px, 0px)`,
    transition: `all ${delay}ms ease`,
  };

  return (
    <SectionContext.Provider value={contextData}>
      <div ref={containerRef} className={classNames(prefixCls, { [className]: className })}>
        <div className={classNames(`${prefixCls}-container`)} style={containerStyle}>
          {scrollBar ? addChildrenWithAnchorId() : children}
        </div>
        {dots && !scrollBar ? renderDots() : null}
      </div>
    </SectionContext.Provider>
  );
};

export default SectionsContainer;
