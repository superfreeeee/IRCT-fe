import { AppIconWrapper } from '@/components/AppIcon';
import StatusPoint from '@/components/StatusPoint';
import styled from 'styled-components';

export const StateTooltipWrapper = styled.div`
  display: none;
  position: fixed;
  left: 215px;
  top: 112px;
  align-items: center;
  min-width: 150px;
  padding: 9px 11px;
  border-radius: 10px;
  font-size: 12px;
  color: #fff;
  background-color: var(--menu_item_tip_bg);
  transform: translate(-50%, -100%);
  transition: all var(--trans_speed_level2);
  z-index: var(--z_index_level3);
  user-select: none;

  &::after {
    content: '';
    display: inline-block;
    position: absolute;
    left: 50%;
    top: calc(100% - 5px);
    width: 0;
    height: 0;
    border: 8px solid transparent;
    transform: translateX(-50%);
    transition: all var(--trans_speed_level2);
  }

  &.visible {
    display: flex;
  }

  ${StatusPoint} {
    margin-right: 9px;
  }

  ${AppIconWrapper} {
    position: relative;
    margin: 0 5px 3px 3px;
  }
`;
