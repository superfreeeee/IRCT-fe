import { atom, atomFamily, selectorFamily } from 'recoil';
import { userBasicInfoFamily } from './user';

export const expandVideoRoomState = atom({
  key: 'roomSpace_expandVideoRoom',
  default: true,
});

interface ChatRecord {
  userId: string;
  text: string;
  createTime: string;
}
// userId/roomId => chat records
export const chatRecordsFamily = atomFamily<ChatRecord[], string>({
  key: 'roomSpace_chatRecords',
  default: [],
});

interface ChatHistoryRecord extends ChatRecord {
  avatar: string;
}
// userId/roomId => chat history
export const chatHistoryFamily = selectorFamily<ChatHistoryRecord[], string>({
  key: 'roomSpace_chatHistory',
  get:
    (id) =>
    ({ get }) => {
      const originRecords = get(chatRecordsFamily(id));
      const records = originRecords.map((record): ChatHistoryRecord => {
        const avatar = get(userBasicInfoFamily(record.userId))?.avatar || '';
        return {
          ...record,
          avatar,
        };
      });
      return records;
    },
});
