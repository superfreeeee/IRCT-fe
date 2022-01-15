import styled from 'styled-components';

import { HidePageWrapper } from '@components/HidePage/styles';

export const ROOM_SPACE_WIDTH = 360;
export const ROOM_SPACE_WIDTH_WIDE = 420;

export const RoomSpaceContainer = styled.div`
  position: relative;
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
  }

  ${HidePageWrapper} {
    position: absolute;
    right: 0;
    top: 70px;
    transform: translate(50%, -50%);

    &:hover {
      box-shadow: -5px 0 5px rgba(0, 0, 0, 0.16);
    }
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
  display: flex;
  justify-content: flex-start;
  align-items: stretch;
  overflow: hidden;
`;

export const RoomSpaceOrigin = styled.div`
  width: ${ROOM_SPACE_WIDTH}px;
  height: 100%;

  &.isChat {
    width: ${ROOM_SPACE_WIDTH_WIDE}px;
  }
`;

export const RoomSpaceVideo = styled.div`
  position: relative;
  flex: 1;
  min-width: 160px;
  height: 100%;
  padding-top: 112px;
  overflow-x: hidden;
  overflow-y: auto;
`;

export const Divider = styled.div`
  margin: 0 25px 0 15px;
  border-bottom: 1px solid #fff;
  user-select: none;
`;
