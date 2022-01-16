import React, { FC, useEffect, useMemo } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { bindActionCreators } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import { AppState } from '@store/reducers';
import { toggleSpaceVisibleAction } from '@store/reducers/space';
import HidePage from '@components/HidePage';
import {
  currentSpaceTypeState,
  expandVideoRoomState,
} from '../state/roomSpace';
import {
  selectedRoomIdState,
  selectedTeamIdState,
  TabOption,
} from '@views/Main/state/im';
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

  const currentSpaceType = useRecoilValue(currentSpaceTypeState);
  const { visible } = useSelector((state: AppState) => state.space);

  const isRoom = currentSpaceType === TabOption.Room;

  const selectedTeamId = useRecoilValue(selectedTeamIdState);
  const selectedRoomId = useRecoilValue(selectedRoomIdState);

  const dispatch = useDispatch();
  /**
   * RoomSpace 展示与否
   *   space.visible
   */
  useEffect(() => {
    const selectedSpaceId =
      currentSpaceType === TabOption.Room ? selectedRoomId : selectedTeamId;

    if (!!selectedSpaceId !== visible) {
      const toggleSpaceVisible = bindActionCreators(
        toggleSpaceVisibleAction,
        dispatch,
      );
      toggleSpaceVisible(!!selectedSpaceId);
    }
  }, [currentSpaceType]);

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
