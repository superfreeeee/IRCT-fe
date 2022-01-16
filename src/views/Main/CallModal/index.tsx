import React, { useCallback, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import classNames from 'classnames';

import BoxIcon, { BoxIconType } from '@components/BoxIcon';
import Avatar from '@components/Avatar';
import { callModalInfoState, callModalVisibleState } from '../state/callModal';
import { MeetingActionBtn } from '../StatusBar/styles';
import { CallModalContainer, CallModalOptions } from './styles';

const invitationAcceptMap = {};

const CallModal = () => {
  const [{ avatar, userId, userName, responsed, accept }, setCallModalInfo] =
    useRecoilState(callModalInfoState);

  const [callModalVisible, setCallModalVisible] = useRecoilState(
    callModalVisibleState,
  );

  const description = responsed
    ? `The ${userName} has refused the invitation`
    : `Inviting into the temporary meeting room`;

  const response = useCallback(
    (accept: boolean) => {
      setCallModalInfo({
        avatar,
        userId,
        userName,
        responsed: true,
        accept,
      });
    },
    [avatar, userId, userName],
  );

  useEffect(() => {
    if (callModalVisible) {
      // ! mock invitation acception
      const accept = invitationAcceptMap[userId];
      if (accept) {
      } else {
        // if refused
        //   auto cancel after 3s
        //   and close after 2s
        let timer = setTimeout(() => {
          response(false);
          if (!accept) {
            timer = setTimeout(() => {
              setCallModalVisible(false);
            }, 2000);
          }
        }, 3000);

        return () => {
          clearTimeout(timer);
        };
      }
    }
  }, [callModalVisible, userId]);

  const cancelCall = () => {
    console.log(`[CallModal] cancelCall`);
    response(false);
    setCallModalVisible(false); // close immediately
  };

  return (
    <CallModalContainer className={classNames({ hide: !callModalVisible })}>
      <Avatar>
        <img src={avatar} width={'100%'} />
      </Avatar>
      <div className="title">{userName}</div>
      <div className={classNames('description', { loading: !responsed })}>
        {description}
      </div>
      <CallModalOptions>
        <MeetingActionBtn
          className={classNames('hangUp', { disabled: responsed && !accept })}
          onClick={cancelCall}
        >
          <BoxIcon type={BoxIconType.PhoneOff} />
        </MeetingActionBtn>
      </CallModalOptions>
    </CallModalContainer>
  );
};

export default CallModal;
