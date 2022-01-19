import { atom, selector } from 'recoil';
import { roomUserIdsBaseFamily } from '../room';
import { teamIdsState } from '../team';
import { userBasicInfoFamily } from '../user';

const PREFIX = 'selectUserModal';

export const selectUserModalVisibleState = atom<boolean>({
  key: `${PREFIX}_selectUserModalVisible`,
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
  key: `${PREFIX}_selectUserModalPosition`,
  default: initPosition,
});

export const selectUserModalSelectableState = atom<boolean>({
  key: `${PREFIX}_selectUserModalSelectable`,
  default: true,
});

export const selectUserModalSelectedUserIdState = atom<string>({
  key: `${PREFIX}_selectUserModalSelectedUserId`,
  default: '',
});

// roomId
export const selectUserModalCandidateScopeState = atom<string>({
  key: `${PREFIX}_selectUserModalCandidateScope`,
  default: '',
});

export const selectUserModalCandidateUserIdsState = atom<string[]>({
  key: `${PREFIX}_selectUserModalCandidateUserIds`,
  // default: [],
  default: ['user-0', 'user-1000', 'user-5', 'user-9'],
});

interface ShowSelectUserModalInfo {
  visible: boolean;
  position?: SelectUserModalPosition;
  selectable?: boolean;
  selectedUserId?: string;
  scopeRoomId?: string;
  candidateUsers?: { id: string; name: string }[];
}
export const selectUserModalControllerInfoState =
  selector<ShowSelectUserModalInfo>({
    key: `${PREFIX}_selectUserModalControllerInfo`,
    get: ({ get }) => {
      const visible = get(selectUserModalVisibleState);
      const position = get(selectUserModalPositionState);
      const selectable = get(selectUserModalSelectableState);
      const selectedUserId = get(selectUserModalSelectedUserIdState);

      let roomId = get(selectUserModalCandidateScopeState);
      let candidateUserIds: string[] = [];
      if (roomId.charAt(0) === '!') {
        roomId = roomId.substring(1);
        const excludeUserIds = get(roomUserIdsBaseFamily(roomId));
        const allUserIds = get(teamIdsState);
        candidateUserIds = allUserIds.filter((userId) => {
          const isUser = !get(userBasicInfoFamily(userId)).isGroup;
          return isUser && !excludeUserIds.includes(userId);
        });
      } else {
        candidateUserIds = get(roomUserIdsBaseFamily(roomId));
      }
      const candidateUsers = candidateUserIds
        .map((userId) => {
          const { id, name } = get(userBasicInfoFamily(userId)) || {};
          if (!id) {
            return null;
          }
          return { id, name };
        })
        .filter((user) => !!user);

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
      }: ShowSelectUserModalInfo,
    ) => {
      set(selectUserModalVisibleState, visible);
      if (selectable !== undefined) {
        set(selectUserModalSelectableState, selectable);
      }
      if (visible) {
        // 可见时为更新 userIds
        set(selectUserModalCandidateScopeState, scopeRoomId);
        position && set(selectUserModalPositionState, position);
      } else {
        // 不可见时为更新 selectedUserId
        set(selectUserModalSelectedUserIdState, selectedUserId);
        set(selectUserModalPositionState, initPosition);
      }
    },
  });
