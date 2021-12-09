import React, { FC, useEffect } from 'react';
import ReactDOM from 'react-dom';

const tooltipContainer = document.createElement('div');

const Tooltip: FC = ({ children }) => {
  useEffect(() => {
    document.body.appendChild(tooltipContainer);

    return () => {
      document.body.removeChild(tooltipContainer);
    };
  }, []);

  return ReactDOM.createPortal(children, tooltipContainer);
};

export default Tooltip;
