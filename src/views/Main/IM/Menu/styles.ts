import styled from 'styled-components';

// ========== Menu Item ==========
export const ItemContainer = styled.li`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 50px;
  padding: 11px;
  border-radius: 10px;
  background-color: var(--menu_item_bg);
  transition: all 0.2s;
  cursor: pointer;
  list-style: none;

  & + & {
    margin-top: 12px;
  }

  &:hover {
    background-color: var(--menu_item_bg_hover);
  }

  &.active {
    background-color: var(--menu_item_bg_active);
  }

  .left {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    overflow: hidden;
  }

  .avatar {
    min-width: 27px;
    height: 27px;
    margin-right: 10px;
    border: 2px solid #fff;
    border-radius: 50%;
  }

  .title {
    flex-shrink: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
  }

  .right {
    flex-grow: 1;
    width: 60px;
    font-size: 12px;
    margin: 0 15px 0 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    /* white-space: nowrap; */
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
export const Container = styled.div`
  width: calc(100% + 14px);
  height: 100%;
  padding: 0 4px 77px 14px;
  overflow-y: auto;
  transform: translateX(-14px);

  &::-webkit-scrollbar {
    display: none;
  }
`;
