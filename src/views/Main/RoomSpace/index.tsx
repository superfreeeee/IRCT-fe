import React, { FC, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import { AppState } from '@store/reducers';
import { TabOption } from '../IM/type';
import Chat from './Chat';
import Header from './Header';
import Room from './Room';
import { Divider, RoomSpaceContainer, RoomSpaceWrapper } from './styles';
import { RoomSpaceType, TabOption2RoomSpaceTypeMapper } from './type';
import { toggleSpaceVisibleAction } from '@store/reducers/space';
import { bindActionCreators } from 'redux';

const option2TypeMapper: TabOption2RoomSpaceTypeMapper = {
  [TabOption.Room]: RoomSpaceType.Room,
  [TabOption.Team]: RoomSpaceType.Chat,
};

interface RoomSpaceProps {}

const RoomSpace: FC<RoomSpaceProps> = ({}) => {
  const { visible, currentSpace } = useSelector(
    (state: AppState) => state.space
  );
  const selectedTeam = useSelector((state: AppState) => state.team.selected);
  const selectedRoom = useSelector((state: AppState) => state.room.selected);

  const dispatch = useDispatch();
  useEffect(() => {
    const selectedSpaceId =
      currentSpace === TabOption.Room ? selectedRoom : selectedTeam;

    // TODO clear console
    // console.log(
    //   `[RoomSpace] selectedSpaceId=${selectedSpaceId}, visible=${visible}`
    // );
    if (!!selectedSpaceId !== visible) {
      const toggleSpaceVisible = bindActionCreators(
        toggleSpaceVisibleAction,
        dispatch
      );
      toggleSpaceVisible(!!selectedSpaceId);
    }
  }, [currentSpace]);

  const roomSpaceType = useMemo(
    () => option2TypeMapper[currentSpace],
    [currentSpace]
  );

  const isRoom = roomSpaceType === RoomSpaceType.Room;

  const BodyEl = useMemo(() => {
    return isRoom ? <Room /> : <Chat />;
  }, [isRoom]);

  return (
    <RoomSpaceContainer
      className={classNames(roomSpaceType, { hidden: !visible })}
    >
      <RoomSpaceWrapper>
        {/* Header */}
        <Header isRoom={isRoom} />
        {/* --------------- */}
        <Divider />
        {/* --------------- */}
        {/* body */}
        {BodyEl}
      </RoomSpaceWrapper>
    </RoomSpaceContainer>
  );
};

export default RoomSpace;
