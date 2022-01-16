import React, { useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import StatusBar from './StatusBar';
import IM from './IM';
import RoomSpace from './RoomSpace';
import { MainContainer } from './styles';
import AppSidebar from './AppSidebar';
import CallModal from './CallModal';
import { teamDataListState } from './state/team';
import { initRoomDataList, initTeamDataList } from './config';
import { roomDataListState } from './state/room';

const useInit = () => {
  // const setTeamDataList = useSetRecoilState(teamDataListState);
  // const setTeamDataList = useSetRecoilState(teamDataListState);
  const [teamList, setTeamDataList] = useRecoilState(teamDataListState);
  const [roomList, setRoomDataList] = useRecoilState(roomDataListState);
  useEffect(() => {
    console.log(`teamList`, teamList);
  }, [teamList]);
  useEffect(() => {
    console.log(`roomList`, roomList);
  }, [roomList]);

  useEffect(() => {
    // init data

    // 初始化用户信息
    setTeamDataList(initTeamDataList);
    // 初始化房间信息
    setRoomDataList(initRoomDataList);
    // TODO 初始化空间位置信息
    // setTeamIds(initTeamIds);
  }, []);
};

const Main = () => {
  useInit();

  console.log(`>>>>>>>> render Main`);

  return (
    <MainContainer>
      <StatusBar />
      <IM />
      <RoomSpace />
      <AppSidebar />
      <CallModal />
    </MainContainer>
  );
};

export default Main;
