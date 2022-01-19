import React, { FC } from 'react';
import { useRecoilValue } from 'recoil';

import { TeamData, teamDataFamily } from '@views/Main/state/team';
import { CandidateWrapper } from './styles';
import StatusPoint from '@components/StatusPoint';
import Avatar from '@components/Avatar';

interface CandidateProps {
  userId: string;
  onSelected: (data: TeamData) => void;
}

const Candidate: FC<CandidateProps> = ({ userId, onSelected }) => {
  const data = useRecoilValue(teamDataFamily(userId));
  const { name, avatar, state } = data;

  return (
    <CandidateWrapper onClick={() => onSelected(data)}>
      <div className="info">
        <Avatar>
          <img src={avatar} width={'100%'} />
        </Avatar>
        <div className="name">{name}</div>
      </div>
      <StatusPoint state={state} size={7} />
    </CandidateWrapper>
  );
};

export default Candidate;
