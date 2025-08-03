import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scrolls to the top of the page whenever the pathname changes
    window.scrollTo(0, 0);
  }, [pathname]); // Depend on pathname, so it re-runs on route change

  // This component doesn't render anything itself, it just performs a side effect
  return null; 
}

export default ScrollToTop;