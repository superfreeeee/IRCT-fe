import React from 'react';

import StatusPoint from '@components/StatusPoint';
import { UserState } from "@views/Main/state/type";
import { StateTooltipWrapper } from './styles';
import {
  stateTooltipInfoState,
  stateTooltipVisibleState,
} from '@views/Main/state/im';
import { useRecoilValue } from 'recoil';
import classNames from 'classnames';
import AppIcon from '@components/AppIcon';

const StateTooltip = () => {
  const visible = useRecoilValue(stateTooltipVisibleState);
  const { position, state, room, usingApp } = useRecoilValue(
    stateTooltipInfoState,
  );

  const stateText = {
    [UserState.Idle]: 'Now free',
    [UserState.Busy]: 'Now busy',
    [UserState.Talking]: 'Now talking',
  }[state];

  const reasonUsingApp = usingApp && (
    <>
      Now using
      <AppIcon type={usingApp} size={20} />
      {usingApp}
    </>
  );

  const currentRoom = room && `${stateText} in ${room}`;

  return (
    <StateTooltipWrapper
      className={classNames({ visible })}
      style={{ ...position }}
    >
      <StatusPoint state={state} />
      {reasonUsingApp || currentRoom || stateText}
    </StateTooltipWrapper>
  );
};

export default StateTooltip;
