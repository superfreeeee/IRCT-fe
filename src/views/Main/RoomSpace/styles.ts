import styled from 'styled-components';

const ROOM_SPACE_WIDTH = 360;

export const RoomSpaceContainer = styled.div`
  flex: 1;
  height: calc(100% - 30px);
  margin: 15px 15px 15px 0;
  border-radius: 10px;
  background-color: var(--container_bg);

  &.hidden {
    display: none;
  }

  &.shrink {
    flex: 0;
    width: ${ROOM_SPACE_WIDTH}px;
  }
`;

export const RoomSpaceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

export const RoomSpaceBody = styled.div`
  flex: 1;
  overflow: hidden;
`;

export const Divider = styled.div`
  margin: 0 25px 0 15px;
  border-bottom: 1px solid #fff;
  user-select: none;
`;
