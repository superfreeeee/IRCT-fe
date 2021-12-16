import React, { FC, useEffect } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import { TooltipState } from '../hooks';
import { ItemTooltip } from '../styles';

const tooltipContainer = document.createElement('div');

interface TooltipProps {
  state: TooltipState;
}

const Tooltip: FC<TooltipProps> = ({
  state: { visible, content, position },
}) => {
  // TODO clear console
  useEffect(() => {
    if (visible) {
      // console.log(`[Menu] tooltipContent = ${content}`);
    }
  }, [visible]);

  // container 生命周期
  useEffect(() => {
    document.body.appendChild(tooltipContainer);

    return () => {
      document.body.removeChild(tooltipContainer);
    };
  }, []);

  return ReactDOM.createPortal(
    <ItemTooltip
      style={{ ...position }}
      className={classNames({ active: visible })}
    >
      {content}
    </ItemTooltip>,
    tooltipContainer
  );
};

export default Tooltip;
