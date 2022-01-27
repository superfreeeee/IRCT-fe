import BoxIcon, { BoxIconType } from '@components/BoxIcon';
import useClosestRef from '@hooks/useClosestRef';
import React, { FC } from 'react';
import { useSetRecoilState } from 'recoil';
import { viewPointStackUpdater } from '../state/okrPath';
import { ViewPointStackActionType } from '../state/type';
import { PathBoardRef } from './PathBoard';
import { OKRIconActions, OKRIconBtn } from './styles';

interface SideActionsProps {
  boardRef: React.MutableRefObject<PathBoardRef>;
}

const SideActions: FC<SideActionsProps> = ({ boardRef }) => {
  /**
   * 返回上一个视图
   */
  const updateStack = useSetRecoilState(viewPointStackUpdater);
  const popRecord = () => {
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
      <OKRIconActions style={{ left: 32, top: 24 }}>
        <OKRIconBtn onClick={popRecord}>
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
      <OKRIconActions style={{ left: 32, bottom: 22 }}>
        <OKRIconBtn onClick={startComment}>
          <BoxIcon type={BoxIconType.MessageDots} />
        </OKRIconBtn>
      </OKRIconActions>
    </>
  );
};

export default SideActions;
