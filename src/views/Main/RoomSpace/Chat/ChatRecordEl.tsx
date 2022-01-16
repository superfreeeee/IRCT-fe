import React, { FC } from 'react';
import { useSelector } from 'react-redux';

import { ChatRecord } from '@store/reducers/space';
import { AppState } from '@store/reducers';
import Avatar from '@components/Avatar';
import { AvatarUsage } from '@components/Avatar/type';
import { ChatRecordWrapper } from './styles';
import BoxIcon, { BoxIconType } from '@components/BoxIcon';
import classNames from 'classnames';
import { useRecoilValue } from 'recoil';
import { currentUserTeamDataState } from '@views/Main/state/user';

interface ChatRecordElProps {
  isInRoom: boolean;
  record: ChatRecord;
}

const ChatRecordEl: FC<ChatRecordElProps> = ({
  isInRoom,
  record: { userId, text, avatar },
}) => {
  const userList = useSelector((state: AppState) => state.team.list);
  const { id: currentUserId, name: selfName } = useRecoilValue(
    currentUserTeamDataState,
  );

  const isSelf = currentUserId === userId;
  const userName = isSelf
    ? selfName
    : userList.filter(({ id }) => id === userId)[0]?.title || userId;

  return (
    <ChatRecordWrapper
      className={classNames({ simple: isInRoom })}
      isSelf={isSelf}
    >
      {isInRoom ? (
        <span>
          {userName}: {text}
        </span>
      ) : (
        <>
          <div className="avatar">
            <Avatar usage={AvatarUsage.RoomSpaceChat} default>
              {avatar ? (
                <img src={avatar} width={'100%'} />
              ) : (
                <BoxIcon type={BoxIconType.Group} />
              )}
            </Avatar>
          </div>
          <div className="text">{text}</div>
        </>
      )}
    </ChatRecordWrapper>
  );
};

export default ChatRecordEl;
