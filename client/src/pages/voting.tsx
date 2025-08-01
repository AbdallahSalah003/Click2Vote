import React, { useState } from 'react';
import { useSnapshot } from 'valtio';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';
import RankedCheckBox from '../components/ui/RankedCheckBox';
import { state, actions } from '../state';

export const Voting: React.FC = () => {
  const currentState = useSnapshot(state);
  const [rankings, setRankings] = useState<string[]>([]);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [confirmVotes, setConfirmVotes] = useState(false);

  const toggleNomination = (id: string) => {
    const position = rankings.findIndex((ranking) => ranking === id);
    const hasVotesRemaining =
      (currentState.poll?.votesPerVoter || 0) - rankings.length > 0;

    if (position < 0 && hasVotesRemaining) {
      setRankings([...rankings, id]);
    } else {
      setRankings([
        ...rankings.slice(0, position),
        ...rankings.slice(position + 1, rankings.length),
      ]);
    }
  };

  const getRank = (id: string) => {
    const position = rankings.findIndex((ranking) => ranking === id);

    return position < 0 ? undefined : position + 1;
  };

  return (
    <div style={{"margin": "80px"}}>
      <div className="w-full">
        <h1>Voting Page</h1>
      </div>
      <div className="w-full">
        {currentState.poll && (
          <>
            <div style={{"marginTop": "20px"}}>
              Select Your Top {currentState.poll?.votesPerVoter} Choices
            </div>
            <div style={{"marginTop": "20px"}}>
              {currentState.poll.votesPerVoter - rankings.length} Votes
              remaining
            </div>
          </>
        )}
        <div style={{"marginTop": "20px"}}>
          {Object.entries(currentState.poll?.nominations || {}).map(
            ([id, nomination]) => (
              <RankedCheckBox
                key={id}
                value={nomination.text}
                rank={getRank(id)}
                onSelect={() => toggleNomination(id)}
              />
            )
          )}
        </div>
      </div>
      <div >
        <button style={{"marginRight": "20px"}}
          disabled={rankings.length < (currentState.poll?.votesPerVoter ?? 100)}
          className="box btn-purple my-2 w-36"
          onClick={() => setConfirmVotes(true)}
        >
          Submit Votes
        </button>
        <ConfirmationDialog
          message="You cannot change your vote after submitting"
          showDialog={confirmVotes}
          onCancel={() => setConfirmVotes(false)}
          onConfirm={() => actions.submitRankings(rankings)}
        />
        {currentState.isAdmin && (
          <>
            <button
              className="box btn-orange my-2 w-36"
              onClick={() => setConfirmCancel(true)}
            >
              Cancel Poll
            </button>
            <ConfirmationDialog
              message="This will cancel the poll and remove all users"
              showDialog={confirmCancel}
              onCancel={() => setConfirmCancel(false)}
              onConfirm={() => actions.cancelPoll()}
            />
          </>
        )}
      </div>
    </div>
  );
};