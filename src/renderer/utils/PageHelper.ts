import { useLocation } from 'react-router-dom';

export const PAGE_DATA: IPageData = {
  '/': {
    title: 'Home',
  },
  '/settings': {
    title: 'Settings',
  },
  default: {
    title: '',
  },
};

export const usePageData = (): PageData => {
  const { pathname } = useLocation();
  return PAGE_DATA[pathname as keyof typeof PAGE_DATA] ?? PAGE_DATA.default;
};

export interface PageData {
  title: string;
}
export interface IPageData {
  [x: string]: PageData;
}
