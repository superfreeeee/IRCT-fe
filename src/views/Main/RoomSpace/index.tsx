import React, { FC, useEffect, useMemo } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import classNames from 'classnames';

import HidePage from '@/components/HidePage';
import { TabOption } from '@/views/Main/state/type';
import {
  currentSpaceTypeState,
  expandVideoRoomState,
  roomSpaceVisibleState,
} from '../state/roomSpace';
import Chat from './Chat';
import Header from './Header';
import Room from './Room';
import VideoRoom from './VideoRoom';
import VideoRoomController from './VideoRoom/VideoRoomController';
import {
  RoomSpaceBody,
  RoomSpaceContainer,
  RoomSpaceOrigin,
  RoomSpaceVideo,
  RoomSpaceWrapper,
} from './styles';
import { okrPathVisibleState } from '../state/okrPath';
import CustomContextMenu from './CustomContextMenu';

interface RoomSpaceProps {}

const RoomSpace: FC<RoomSpaceProps> = ({}) => {
  const okrPathVisible = useRecoilValue(okrPathVisibleState);

  /**
   * 展开 RoomSpace
   */
  const [expandVideoRoom, setExpandVideoRoom] =
    useRecoilState(expandVideoRoomState);
  const toggleExpandVideoRoom = () => setExpandVideoRoom(!expandVideoRoom);

  const currentSpaceType = useRecoilValue(currentSpaceTypeState);
  const visible = useRecoilValue(roomSpaceVisibleState);

  const isRoom = currentSpaceType === TabOption.Room;

  const BodyEl = useMemo(() => {
    return isRoom ? <Room /> : <Chat />;
  }, [isRoom]);

  return (
    !okrPathVisible && (
      <RoomSpaceContainer
        className={classNames({
          hidden: !visible,
          shrink: !isRoom || !expandVideoRoom,
        })}
      >
        <RoomSpaceWrapper>
          {/* Header */}
          <Header isRoom={isRoom} expand={expandVideoRoom} />
          {/* body: Room | Chat */}
          <RoomSpaceBody>
            {/* SimulationArea | MeetingRoom */}
            <RoomSpaceOrigin className={classNames({ isChat: !isRoom })}>
              {BodyEl}
            </RoomSpaceOrigin>
            <CustomContextMenu />
            {/* Video */}
            <RoomSpaceVideo
              className={classNames({ visible: isRoom && expandVideoRoom })}
            >
              <VideoRoom />
              <VideoRoomController />
            </RoomSpaceVideo>
          </RoomSpaceBody>
        </RoomSpaceWrapper>
        {isRoom && (
          <HidePage revert={!expandVideoRoom} onClick={toggleExpandVideoRoom} />
        )}
      </RoomSpaceContainer>
    )
  );
};

export default RoomSpace;
