import styled from 'styled-components';

import Avatar from '@components/Avatar';

// ========== Menu Item ==========
export const ItemContainer = styled.li`
  position: relative;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 66px;
  padding: 12px;
  transition: all 0.25s;
  overflow: hidden;
  cursor: pointer;
  list-style: none;

  &:hover {
    background-color: var(--menu_item_bg_hover);
  }

  &.selected {
    background-color: var(--menu_item_bg_active);
  }

  ${Avatar} {
    width: 42px;
    height: 42px;
    margin-right: 10px;
  }

  .content {
    flex: 1;
    overflow: hidden;
  }

  .title {
    font-size: 14px;
    font-weight: 500;
  }

  .subtitle {
    font-size: 12px;
  }

  .title,
  .subtitle {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .optional {
    font-size: 12px;
    overflow: hidden;

    &.inTeam {
      align-self: flex-start;
      line-height: 21px;
    }
  }
`;

export const ItemTooltip = styled.div`
  display: none;
  position: absolute;
  min-width: 240px;
  padding: 14px 12px;
  border-radius: 10px;
  font-size: 12px;
  color: #fff;
  transform: translateX(-50%);
  transition: all 0.2s;
  z-index: 1000;

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
    transition: all 0.2s;
  }

  &.active {
    display: block;
    background-color: var(--menu_item_tip_bg);
  }

  &.active::after {
    border-top: 12px solid var(--menu_item_tip_bg);
  }
`;

// ========== Menu ==========
// 分块
export const MenuSepContainer = styled.ul`
  width: 100%;
  color: #fff;
`;

// 置顶 / 其他
export const MenuSepTag = styled.div`
  margin-bottom: 8px;
  font-size: 12px;
  color: #fff;

  ${MenuSepContainer} + & {
    margin-top: 12px;
  }
`;

// 总容器
export const MenuContainer = styled.div`
  width: calc(100% + 14px);
  height: 100%;
  padding: 0 0 66px 14px;
  overflow-y: auto;
  transform: translateX(-14px);

  &::-webkit-scrollbar {
    display: none;
  }
`;
