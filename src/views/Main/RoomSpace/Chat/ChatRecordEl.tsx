import React, { FC } from 'react';
import { useRecoilValue } from 'recoil';
import classNames from 'classnames';

import {
  currentUserTeamDataState,
  userBasicInfoFamily,
} from '@/views/Main/state/user';
import { ChatHistoryRecord } from '@/views/Main/state/roomSpace';
import Avatar from '@/components/Avatar';
import { AvatarUsage } from '@/components/Avatar/type';
import BoxIcon, { BoxIconType } from '@/components/BoxIcon';
import { ChatRecordWrapper } from './styles';

interface ChatRecordElProps {
  isInRoom: boolean;
  record: ChatHistoryRecord;
}

const ChatRecordEl: FC<ChatRecordElProps> = ({
  isInRoom,
  record: { userId, text, avatar },
}) => {
  const { id: currentUserId } = useRecoilValue(currentUserTeamDataState);

  const isSelf = currentUserId === userId;
  const userName = useRecoilValue(userBasicInfoFamily(userId)).name;

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
