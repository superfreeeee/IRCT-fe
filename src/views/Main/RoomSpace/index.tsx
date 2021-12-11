import Avatar from '@components/Avatar';
import { AvatarUsage } from '@components/Avatar/type';
import { AppState } from '@store/reducers';
import classNames from 'classnames';
import React, { FC, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { TabOption } from '../IM/type';
import Chat from './Chat';
import HeaderActions from './HeaderActions';
import Room from './Room';

import {
  Divider,
  HeaderMain,
  HeaderSide,
  RoomSpaceContainer,
  RoomSpaceHeader,
  RoomSpaceWrapper,
} from './styles';
import { RoomSpaceType, TabOption2RoomSpaceTypeMapper } from './type';

const option2TypeMapper: TabOption2RoomSpaceTypeMapper = {
  [TabOption.Room]: RoomSpaceType.Room,
  [TabOption.Team]: RoomSpaceType.Chat,
};

interface RoomSpaceProps {}

const RoomSpace: FC<RoomSpaceProps> = ({}) => {
  const { visible, currentSpace } = useSelector(
    (state: AppState) => state.space
  );

  const isRoom = currentSpace === TabOption.Room;

  const roomSpaceType = useMemo(
    () => option2TypeMapper[currentSpace],
    [currentSpace]
  );

  const BodyEl = useMemo(() => {
    return isRoom ? <Room /> : <Chat />;
  }, [isRoom]);

  return (
    <RoomSpaceContainer className={classNames(roomSpaceType)}>
      <RoomSpaceWrapper>
        {/* Header */}
        <RoomSpaceHeader>
          <HeaderMain>
            {isRoom ? (
              <span>Coffee Room</span>
            ) : (
              <>
                <Avatar usage={AvatarUsage.RoomSpaceHeader} />
                <span>Joe Zhao</span>
              </>
            )}
          </HeaderMain>
          <HeaderSide>
            <HeaderActions />
          </HeaderSide>
        </RoomSpaceHeader>
        {/* --------------- */}
        <Divider />
        {/* --------------- */}
        {/* body */}
        {BodyEl}
        {/* input */}
      </RoomSpaceWrapper>
    </RoomSpaceContainer>
  );
};

export default RoomSpace;
