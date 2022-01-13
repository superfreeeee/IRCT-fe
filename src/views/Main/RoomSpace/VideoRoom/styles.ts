import styled from 'styled-components';

export const VideoRoomContainer = styled.div`
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 10px;
  height: 100%;
  padding: 112px 30px 83px;
  z-index: 1;
  overflow: auto;
`;

export const VideoBlockContainer = styled.div`
  width: 230px;
  overflow: hidden;

  /* 外部宽度 773 */
  /* 3 列 = 773 + 230 * 3 + 10 * 2 */
  @media (min-width: 1483px) {
    width: calc(33% - 7px);

    &.sm {
      width: calc(21% - 2px);
    }
  }
  /* 2 列 = 773 + 230 * 2 + 10 */
  @media (min-width: 1243px) and (max-width: 1483px) {
    width: calc(50% - 5px);

    &.sm {
      width: calc(32.5% - 2.5px);
    }
  }
  /* 1 列 = 773 + _ */
  @media (max-width: 1243px) {
    width: 100%;

    &.sm {
      width: 65%;
    }
  }

  &.hidden {
    width: 0;
  }
`;

export const VideoBlockWrapper = styled.div`
  position: relative;
  padding-top: 56.25%;
`;

export const VideoBlockContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 5px;
  background-color: #666666;
`;

export const VideoRoomControllerContainer = styled.div`
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
  box-sizing: content-box;
  width: 100%;
  height: 40px;
  padding: 20px 0 23px;
  background-color: var(--container_bg);
`;
