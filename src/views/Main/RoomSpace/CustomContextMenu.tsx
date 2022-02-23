import React, { useCallback, useMemo } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { currentTabState, selectedTeamIdState } from '@views/Main/state/im';
import { currentSpaceIdState } from '@views/Main/state/roomSpace';
import {
  okrPathVisibleState,
  viewPointStackUpdater,
} from '@views/Main/state/okrPath';
import { TabOption, ViewPointStackActionType } from '@views/Main/state/type';
import { ViewPointType } from '@views/Main/state/okrDB/type';
import {
  contextMenuTargetUserIdState,
  contextMenuVisibleState,
} from '@views/Main/state/modals/customContextMenu';
import ContextMenu from '@components/ContextMenu';
import {
  CustomContextMenuItem,
  CustomContextMenuWrapper,
} from '@components/ContextMenu/styles';
import BoxIcon, { BoxIconType } from '@components/BoxIcon';

const CustomContextMenu = () => {
  const setVisible = useSetRecoilState(contextMenuVisibleState);
  const updateStack = useSetRecoilState(viewPointStackUpdater);
  const setOKRPathVisible = useSetRecoilState(okrPathVisibleState);
  const setTab = useSetRecoilState(currentTabState);
  const setSelectedTeamId = useSetRecoilState(selectedTeamIdState);
  const setCurrentSpaceId = useSetRecoilState(currentSpaceIdState);
  const [targetUserId, setTargetUserId] = useRecoilState(
    contextMenuTargetUserIdState,
  );
  const onClose = useCallback(() => {
    setVisible(false);
    setTargetUserId('');
  }, []);
  const optiosnEl = useMemo(() => {
    const goChat = () => {
      console.log(`[CustomContextMenu] goChat`);
      setTab(TabOption.Team);
      setSelectedTeamId(targetUserId);
      setCurrentSpaceId(targetUserId);

      onClose();
    };

    const pushPath = () => {
      console.log(`[CustomContextMenu] pushPath: ${targetUserId}`);
      setOKRPathVisible(true);
      updateStack({
        type: ViewPointStackActionType.Push,
        record: {
          type: ViewPointType.Personal,
          centerUserId: targetUserId, // userId
        },
      });
      onClose();
    };

    const options = [
      {
        iconType: BoxIconType.MessageDots,
        title: '发送消息',
        onClick: goChat,
      },
      {
        iconType: BoxIconType.Branch,
        title: '进入Path',
        onClick: pushPath,
      },
    ];

    return (
      <CustomContextMenuWrapper>
        {options.map(({ iconType, title, onClick }) => (
          <CustomContextMenuItem key={title} onClick={onClick}>
            {iconType ? <BoxIcon type={iconType} size={'xs'} /> : null}
            <span>{title}</span>
          </CustomContextMenuItem>
        ))}
      </CustomContextMenuWrapper>
    );
  }, [targetUserId]);

  return <ContextMenu onCancel={onClose}>{optiosnEl}</ContextMenu>;
};

export default CustomContextMenu;
