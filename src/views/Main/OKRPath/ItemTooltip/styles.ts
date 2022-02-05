import styled from 'styled-components';

const MIN_WIDTH = 85;
export const MAX_WIDTH = 300;

export const ItemTooltipWrapper = styled.div`
  /* position */
  position: absolute;
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
  transform: translateX(-50%);

  /* for text */
  font-size: 12px;
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  /* for visible */
  transition: visibility 100ms 150ms; // 避免 reshape 时闪烁
  visibility: visible;

  &.hide {
    visibility: hidden;
  }

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
