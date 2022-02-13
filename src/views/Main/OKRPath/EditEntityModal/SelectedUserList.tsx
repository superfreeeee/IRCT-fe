import React, {
  FC,
  MouseEvent,
  MutableRefObject,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import classNames from 'classnames';

import { EntityType, UserEntity } from '@views/Main/state/okrDB/type';
import { selectUserModalControllerInfoState } from '@views/Main/state/modals/selectUserModal';
import useShadowState from '@hooks/useShadowState';
import useWaitFor from '@hooks/useWaitFor';
import BoxIcon, { BoxIconType } from '@components/BoxIcon';
import { userBasicInfoFamily } from '@views/Main/state/user';
import Avatar from '@components/Avatar';
import { EditContentUserList } from './styles';
import useClosestRef from '@hooks/useClosestRef';

interface RemoveableUserAvatarProps {
  user: UserEntity;
  remove?: (e: MouseEvent) => void;
  reselect?: (e: MouseEvent) => void;
}

const RemoveableUserAvatar: FC<RemoveableUserAvatarProps> = ({
  user,
  remove,
  reselect,
}) => {
  const { maskOn, onClick } = useMemo(() => {
    if (remove && reselect) {
      console.warn(
        `[RemoveableUserAvatar] multiple action available, remove first`,
      );
    }

    const maskOn = !!(remove || reselect);

    return {
      maskOn,
      onClick: remove || reselect,
    };
  }, [remove, reselect]);

  const iconType =
    maskOn && (remove ? BoxIconType.Trash : BoxIconType.TransferAlt);

  return (
    <Avatar onClick={onClick}>
      <img src={user.avatar} width={'100%'} />
      {maskOn && (
        <div className="removeMask">
          <BoxIcon type={iconType} size={'xs'} />
        </div>
      )}
    </Avatar>
  );
};

interface SelectedUserListProps {
  targetType: EntityType;
  users: UserEntity[];
  usersRef: MutableRefObject<UserEntity[]>;
}

const SelectedUserList: FC<SelectedUserListProps> = ({
  targetType,
  users,
  usersRef,
}) => {
  const showUserList = [
    EntityType.O,
    EntityType.Project,
    EntityType.Todo,
  ].includes(targetType);

  const reverIcon = targetType === EntityType.O;

  const [shadowUsers, setShadowUsers] = useShadowState(users);
  useClosestRef(shadowUsers, usersRef);

  const isSingle = targetType === EntityType.Todo;

  // prefix
  const prefixEl = useMemo(() => {
    if (!showUserList) {
      return null;
    }

    if (targetType === EntityType.Todo) {
      return <span>Assigned to: </span>;
    }

    return (
      <BoxIcon
        type={
          targetType === EntityType.O
            ? BoxIconType.ArrowDownLeft
            : BoxIconType.User
        }
      />
    );
  }, [showUserList, targetType]);

  const [
    { visible: modalVisible, selectedUserId },
    setSelectUserModalControllerInfo,
  ] = useRecoilState(selectUserModalControllerInfoState);
  const isWaitingRef = useRef(false);
  /**
   * 重新选择目标
   */
  const reselect = useCallback((e: MouseEvent) => {
    const { clientX, clientY } = e;
    const excludeUserIds = usersRef.current.map(({ id }) => id);
    setSelectUserModalControllerInfo({
      visible: true,
      selectable: true,
      position: { left: clientX + 5, top: clientY + 5 },
      scopeRoomId: '',
      excludeUserIds,
    });
    isWaitingRef.current = true;
  }, []);
  // ========== 选中人物 ==========
  const addNewEl = useMemo(() => {
    return (
      <div className="addNewBtn" onClick={reselect}>
        <BoxIcon type={BoxIconType.Plus} />
      </div>
    );
  }, []);
  const selectedUserInfo = useRecoilValue(userBasicInfoFamily(selectedUserId));
  useWaitFor(
    !modalVisible,
    () => {
      if (selectedUserId) {
        isWaitingRef.current = false;

        const { id, name, avatar } = selectedUserInfo;
        const selectedUserEntity = { id, name, avatar };
        if (isSingle) {
          setShadowUsers([selectedUserEntity]);
        } else {
          setShadowUsers([...shadowUsers, selectedUserEntity]);
        }
      } else {
        isWaitingRef.current = false;
      }
    },
    isWaitingRef.current,
  );

  const bindRemoveUser = useCallback(
    (user: UserEntity) => () => {
      const index = shadowUsers.indexOf(user);
      if (index < 0) {
        console.error(`[SelectedUserList] remove unexists user:`, user);
      } else {
        shadowUsers.splice(index, 1);
        setShadowUsers([...shadowUsers]);
      }
    },
    [shadowUsers],
  );
  const usersEl = useMemo(() => {
    if (isSingle) {
      // for Todo => assign to someone
      if (shadowUsers.length === 0) {
        return addNewEl;
      } else {
        if (shadowUsers.length > 1) {
          console.warn(`[SelectedUserList] redundant user`, shadowUsers);
        }
        return (
          <RemoveableUserAvatar user={shadowUsers[0]} reselect={reselect} />
        );
      }
    } else {
      // for O/Project => link to somebody
      return (
        <>
          {shadowUsers.map((user) => (
            <RemoveableUserAvatar
              key={user.id}
              user={user}
              remove={bindRemoveUser(user)}
            />
          ))}
          {addNewEl}
        </>
      );
    }
  }, [shadowUsers, isSingle, bindRemoveUser]);

  return (
    <EditContentUserList className={classNames({ reverIcon })}>
      {showUserList && (
        <>
          {prefixEl}
          {usersEl}
        </>
      )}
    </EditContentUserList>
  );
};

export default SelectedUserList;
