import React, { useCallback, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import classNames from 'classnames';

import BoxIcon, { BoxIconType } from '@components/BoxIcon';
import Avatar from '@components/Avatar';
import { callModalInfoState, callModalVisibleState } from '../../state/modals/callModal';
import { MeetingActionBtn } from '../../StatusBar/styles';
import { CallModalContainer, CallModalOptions } from './styles';
import { invitationAcceptList } from '../../config';
import Modal from '@components/Modal';
import { useCreateTempMeeting } from '../../state/hooks';

const CallModal = () => {
  const [{ avatar, userId, userName, responsed, accept }, setCallModalInfo] =
    useRecoilState(callModalInfoState);

  const [callModalVisible, setCallModalVisible] = useRecoilState(
    callModalVisibleState,
  );

  const description =
    responsed && !accept
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

  const createTempMeeting = useCreateTempMeeting(userId);
  useEffect(() => {
    if (callModalVisible) {
      // 请求语音后自动流程

      // ! mock invitation acception
      const accept = invitationAcceptList.includes(userId);
      // 3s 后自动响应
      let timer = setTimeout(() => {
        if (accept) {
          // 1. 接受语音
          console.log(`[CallModal] accept = ${userId}`);
          response(true);
          setCallModalVisible(false);
          createTempMeeting();
        } else {
          // 2. 拒绝语音
          console.log(`[CallModal] refused = ${userId}`);
          response(false);
          timer = setTimeout(() => {
            // 2s 后自动关闭
            setCallModalVisible(false);
          }, 2000);
        }
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [callModalVisible, userId]);

  const cancelCall = () => {
    if (responsed) {
      return;
    }
    console.log(`[CallModal] cancelCall`);
    response(false);
    setCallModalVisible(false); // close immediately
  };

  return (
    <Modal visible={callModalVisible}>
      <CallModalContainer>
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
    </Modal>
  );
};

export default CallModal;
