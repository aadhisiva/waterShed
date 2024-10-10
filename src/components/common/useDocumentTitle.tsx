// useDocumentTitle.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useDocumentTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const pageTitle = path === '/' ? 'Watershed' : path.substring(1).charAt(0).toUpperCase() + path.slice(2);
    document.title = `Watershed | ${pageTitle}`;
  }, [location]);
};

export default useDocumentTitle;