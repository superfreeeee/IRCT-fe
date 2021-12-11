import { useCallback, useState } from 'react';

import { TooltipPosition } from './type';

/**
 * Tooltip
 */
export interface TooltipState {
  visible: boolean;
  content: string;
  position: TooltipPosition;
}

export interface TooltipActions {
  showTooltip: (content: string, position: TooltipPosition) => void;
  closeTooltip: () => void;
}

export const useTooltip = (): [TooltipState, TooltipActions] => {
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState('');
  const [position, setPosition] = useState<TooltipPosition>({
    bottom: 0,
    left: 0,
  });

  const showTooltip = useCallback(
    (content: string, position: TooltipPosition) => {
      setVisible(true);
      setContent(content);
      setPosition(position);
    },
    []
  );

  const closeTooltip = useCallback(() => {
    setVisible(false);
  }, []);

  return [
    { visible, content, position },
    { showTooltip, closeTooltip },
  ];
};
