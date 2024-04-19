import { useEffect } from 'react';

export default function useScrollTop() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
}
