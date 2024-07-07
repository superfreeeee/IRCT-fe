import React, { FC, MutableRefObject } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

import BoxIcon, { BoxIconType } from '@/components/BoxIcon';
import {
  okrPathListVisibleState,
  viewPointStackState,
  viewPointStackUpdater,
  viewPointTypeState,
} from '../state/okrPath';
import { ViewPointStackActionType } from '../state/type';
import { PathBoardRef } from './PathBoard';
import { OKRIconActions, OKRIconBtn } from './styles';
import classNames from 'classnames';
import { PathListRef } from './PathList';
import { ViewPointType } from '../state/okrDB/type';

interface SideActionsProps {
  boardRef: MutableRefObject<PathBoardRef>;
  listRef: MutableRefObject<PathListRef>;
}

const SideActions: FC<SideActionsProps> = ({ boardRef, listRef }) => {
  const viewPointStack = useRecoilValue(viewPointStackState);

  const popDisabled = viewPointStack.length === 0;

  /**
   * 直接返回组织视图 & 清除栈记录
   */
  const updateStack = useSetRecoilState(viewPointStackUpdater);
  const clearRecord = () => {
    updateStack({ type: ViewPointStackActionType.Clear });
  };

  /**
   * 返回上一个视图
   */
  const popRecord = () => {
    if (popDisabled) {
      return;
    }
    updateStack({ type: ViewPointStackActionType.Pop });
  };

  /**
   * 搜寻?
   */
  const searchPath = () => {
    console.log(`[OKRPath.SideActions] searchPath`);
    // TODO
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
  const viewPointType = useRecoilValue(viewPointTypeState);
  const setListVisible = useSetRecoilState(okrPathListVisibleState);
  const startComment = () => {
    console.log(`[OKRPath.SideActions] startComment`);
    if (viewPointType === ViewPointType.Personal) {
      setListVisible(true);
      setTimeout(() => {
        listRef.current.focusComment();
      });
    }
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
        </OKRIconBtn>
        <OKRIconBtn
          className={classNames({ disabled: popDisabled })}
          onClick={clearRecord}
        >
          <BoxIcon type={BoxIconType.Home} />
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
