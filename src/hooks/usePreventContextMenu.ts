import { useEffect } from 'react';

const instead = (e: MouseEvent) => e.preventDefault();

const usePreventContextMenu = () => {
  useEffect(() => {
    if (document.oncontextmenu !== instead) {
      const origin = document.oncontextmenu;

      document.oncontextmenu = instead;
      () => {
        document.oncontextmenu = origin;
      };
    }
  }, []);
};

export default usePreventContextMenu;
