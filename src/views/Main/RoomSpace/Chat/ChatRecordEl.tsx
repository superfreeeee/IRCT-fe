import React, { FC } from 'react';
import { useSelector } from 'react-redux';

import { ChatRecord } from '@store/reducers/space';
import { AppState } from '@store/reducers';
import Avatar from '@components/Avatar';
import { AvatarUsage } from '@components/Avatar/type';
import { ChatRecordWrapper } from './styles';
import BoxIcon, { BoxIconType } from '@components/BoxIcon';

interface ChatRecordElProps {
  record: ChatRecord;
}

const ChatRecordEl: FC<ChatRecordElProps> = ({ record: { userId, text } }) => {
  const currentUserId = useSelector((state: AppState) => state.user.id);

  return (
    <ChatRecordWrapper isSelf={currentUserId === userId}>
      <div className="avatar">
        <Avatar usage={AvatarUsage.RoomSpaceChat} default>
          <BoxIcon type={BoxIconType.Group} />
        </Avatar>
      </div>
      <div className="text">{text}</div>
    </ChatRecordWrapper>
  );
};

export default ChatRecordEl;
