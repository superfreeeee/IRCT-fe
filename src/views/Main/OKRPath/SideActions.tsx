import React, { FC } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import BoxIcon, { BoxIconType } from '@components/BoxIcon';
import { viewPointStackState, viewPointStackUpdater } from '../state/okrPath';
import { ViewPointStackActionType } from '../state/type';
import { PathBoardRef } from './PathBoard';
import { OKRIconActions, OKRIconBtn } from './styles';
import classNames from 'classnames';

interface SideActionsProps {
  boardRef: React.MutableRefObject<PathBoardRef>;
}

const SideActions: FC<SideActionsProps> = ({ boardRef }) => {
  const viewPointStack = useRecoilValue(viewPointStackState);

  const popDisabled = viewPointStack.length === 0;

  /**
   * 返回上一个视图
   */
  const updateStack = useSetRecoilState(viewPointStackUpdater);
  const popRecord = () => {
    if (popDisabled) {
      return;
    }
    console.log(`[OKRPath.SideActions] popRecord`);
    updateStack({
      type: ViewPointStackActionType.Pop,
    });
  };

  /**
   * 搜寻?
   */
  const searchPath = () => {
    console.log(`[OKRPath.SideActions] searchPath`);
  };

  /**
   * 重置缩放
   */
  const resetZoom = () => {
    boardRef.current.resetZoom();
  };

  /**
   * 去发评论
   */
  const startComment = () => {
    console.log(`[OKRPath.SideActions] startComment`);
  };

  return (
    <>
      {/* left-top actions */}
      <OKRIconActions style={{ left: 22, top: 24 }}>
        <OKRIconBtn
          className={classNames({ disabled: popDisabled })}
          onClick={popRecord}
        >
          <BoxIcon type={BoxIconType.Undo} />
          {/* <img src={''} alt="" /> */}
        </OKRIconBtn>
        <OKRIconBtn onClick={searchPath}>
          <BoxIcon type={BoxIconType.SearchAlt} />
        </OKRIconBtn>
        <OKRIconBtn onClick={resetZoom}>
          <BoxIcon type={BoxIconType.TargetLock} />
        </OKRIconBtn>
      </OKRIconActions>
      {/* left-bottom actions */}
      <OKRIconActions style={{ left: 22, bottom: 22 }}>
        <OKRIconBtn onClick={startComment}>
          <BoxIcon type={BoxIconType.MessageDots} />
        </OKRIconBtn>
      </OKRIconActions>
    </>
  );
};

export default SideActions;
