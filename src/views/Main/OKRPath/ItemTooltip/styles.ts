import styled from 'styled-components';

const MIN_WIDTH = 85;
export const MAX_WIDTH = 300;

export const ItemTooltipContainer = styled.div`
  position: absolute;
  transform: translateX(-50%);

  /* for visible */
  transition: visibility 100ms 150ms; // 避免 reshape 时闪烁
  visibility: visible;

  &.turn {
    transform: translate(-50%, 100%) translateY(20px);
  }

  &.hide {
    visibility: hidden;
  }

  &::after {
    content: '';
    position: absolute;
    left: 50%;
    bottom: 2px;
    border-top: 7px solid #242424;
    border-bottom: 0;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    transform: translate(-50%, 100%);
  }

  &.turn::after {
    bottom: 100%;
    transform: translate(-50%, 2px) rotate(180deg);
  }
`;

export const ItemTooltipWrapper = styled.div`
  /* position */
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;

  /* for box */
  min-width: ${MIN_WIDTH}px;
  max-width: ${MAX_WIDTH}px;
  padding: 6px 15px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  background-color: #242424;

  /* for text */
  font-size: 12px;
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  .user {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .content {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
