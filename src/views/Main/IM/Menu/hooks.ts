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
