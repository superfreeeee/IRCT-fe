import { atom, selector } from 'recoil';
import { roomUserIdsBaseFamily } from '../room';
import { teamIdsState } from '../team';
import { StateNamespace } from '../type';
import { userBasicInfoFamily } from '../user';
import { createPrefixer } from '../utils';

const prefixer = createPrefixer(StateNamespace.SelectUserModal);

export const selectUserModalVisibleState = atom<boolean>({
  key: prefixer('selectUserModalVisible'),
  default: false,
});

const initPosition = {
  // left: '100vw',
  // top: '100vh',
  left: 600,
  top: 100,
};
interface SelectUserModalPosition {
  left: number | string;
  top: number | string;
}
export const selectUserModalPositionState = atom<SelectUserModalPosition>({
  key: prefixer('selectUserModalPosition'),
  default: initPosition,
});

export const selectUserModalSelectableState = atom<boolean>({
  key: prefixer('selectUserModalSelectable'),
  default: true,
});

export const selectUserModalSelectedUserIdState = atom<string>({
  key: prefixer('selectUserModalSelectedUserId'),
  default: '',
});

// roomId
export const selectUserModalCandidateScopeState = atom<string>({
  key: prefixer('selectUserModalCandidateScope'),
  default: '',
});

export const selectUserModalExcludeUserIdsState = atom<string[]>({
  key: prefixer('selectUserModalExcludeUserIds'),
  default: [],
});

/**
 * 选人组件控制器模块
 * 对于 getter
 *   get: { visible, selectedUserId, candidateUsers }
 *   set: {
 *     visible: true,
 *     selectable?,
 *     scopeRoomId
 *     position
 *   } | {
 *     visible: false,
 *     selectable?,
 *     selectedUserId
 *   }
 */
interface ShowSelectUserModalInfo {
  visible: boolean;
  position?: SelectUserModalPosition;
  selectable?: boolean;
  selectedUserId?: string;
  scopeRoomId?: string;
  excludeUserIds?: string[];
  candidateUsers?: { id: string; name: string }[];
}
export const selectUserModalControllerInfoState =
  selector<ShowSelectUserModalInfo>({
    key: prefixer('selectUserModalControllerInfo'),
    get: ({ get }) => {
      const visible = get(selectUserModalVisibleState);
      const position = get(selectUserModalPositionState);
      const selectable = get(selectUserModalSelectableState);
      const selectedUserId = get(selectUserModalSelectedUserIdState);

      // get userIds from room
      let roomId = get(selectUserModalCandidateScopeState);
      let candidateUserIds: string[] = [];
      if (!roomId) {
        // no scope => enable all users
        const allUserIds = get(teamIdsState);
        candidateUserIds = allUserIds;
      } else if (roomId.charAt(0) === '!') {
        // prefix ! => exclude a room
        roomId = roomId.substring(1);
        const excludeUserIds = get(roomUserIdsBaseFamily(roomId));
        const allUserIds = get(teamIdsState);
        candidateUserIds = allUserIds.filter((userId) => {
          const isUser = !get(userBasicInfoFamily(userId)).isGroup;
          return isUser && !excludeUserIds.includes(userId);
        });
      } else {
        // normal => get userIds from one room
        candidateUserIds = get(roomUserIdsBaseFamily(roomId));
      }

      // id => userBasicInfo
      const excludeIdSet = new Set(get(selectUserModalExcludeUserIdsState));
      const candidateUsers = candidateUserIds
        .filter((userId) => !excludeIdSet.has(userId))
        .map((userId) => get(userBasicInfoFamily(userId)))
        .filter((user) => {
          const { id, isGroup } = user;
          return id && !isGroup;
        })
        .map(({ id, name }) => ({ id, name }));

      return {
        visible,
        position,
        selectable,
        selectedUserId,
        candidateUsers,
      };
    },
    set: (
      { set },
      {
        visible,
        selectable,
        position,
        selectedUserId,
        scopeRoomId,
        excludeUserIds = [],
      }: ShowSelectUserModalInfo,
    ) => {
      set(selectUserModalVisibleState, visible);
      if (selectable !== undefined) {
        set(selectUserModalSelectableState, selectable);
      }
      if (visible) {
        // 可见时为更新 userIds
        set(selectUserModalCandidateScopeState, scopeRoomId);
        set(selectUserModalExcludeUserIdsState, excludeUserIds);
        position && set(selectUserModalPositionState, position);
      } else {
        // 不可见时为更新 selectedUserId
        set(selectUserModalSelectedUserIdState, selectedUserId);
        set(selectUserModalPositionState, initPosition);
      }
    },
  });
