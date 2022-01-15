import React, { FC, useEffect, useMemo } from 'react';
import { useRecoilState } from 'recoil';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import { AppState } from '@store/reducers';
import { toggleSpaceVisibleAction } from '@store/reducers/space';
import HidePage from '@components/HidePage';
import { expandVideoRoomState } from '../state/roomSpace';
import { TabOption } from '../IM/type';
import Chat from './Chat';
import Header from './Header';
import Room from './Room';
import {
  RoomSpaceBody,
  RoomSpaceContainer,
  RoomSpaceOrigin,
  RoomSpaceVideo,
  RoomSpaceWrapper,
} from './styles';
import VideoRoom from './VideoRoom';
import VideoRoomController from './VideoRoom/VideoRoomController';

interface RoomSpaceProps {}

const RoomSpace: FC<RoomSpaceProps> = ({}) => {
  const [expandVideoRoom, setExpandVideoRoom] =
    useRecoilState(expandVideoRoomState);
  const { visible, currentSpace } = useSelector(
    (state: AppState) => state.space,
  );
  const selectedTeam = useSelector((state: AppState) => state.team.selected);
  const selectedRoom = useSelector((state: AppState) => state.room.selected);

  const dispatch = useDispatch();
  /**
   * RoomSpace 展示与否
   *   space.visible
   */
  useEffect(() => {
    const selectedSpaceId =
      currentSpace === TabOption.Room ? selectedRoom : selectedTeam;

    if (!!selectedSpaceId !== visible) {
      const toggleSpaceVisible = bindActionCreators(
        toggleSpaceVisibleAction,
        dispatch,
      );
      toggleSpaceVisible(!!selectedSpaceId);
    }
  }, [currentSpace]);

  const isRoom = currentSpace === TabOption.Room;

  const BodyEl = useMemo(() => {
    return isRoom ? <Room /> : <Chat />;
  }, [isRoom]);

  return (
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
          <RoomSpaceOrigin className={classNames({ isChat: !isRoom })}>
            {BodyEl}
          </RoomSpaceOrigin>
          {isRoom && expandVideoRoom && (
            <RoomSpaceVideo>
              <VideoRoom />
              <VideoRoomController />
            </RoomSpaceVideo>
          )}
        </RoomSpaceBody>
      </RoomSpaceWrapper>
      {isRoom && (
        <HidePage
          revert={!expandVideoRoom}
          onClick={() => setExpandVideoRoom(!expandVideoRoom)}
        />
      )}
    </RoomSpaceContainer>
  );
};

export default RoomSpace;
