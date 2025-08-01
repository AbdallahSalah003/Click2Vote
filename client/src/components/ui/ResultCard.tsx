import React from 'react';
import { Results } from 'shared';

type ResultCard = {
  results: DeepReadonly<Results>;
};

const ResultCard: React.FC<ResultCard> = ({ results }) => {
  return (
    <>
    <div style={{"width": "20%"}}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          paddingBottom: '0.5rem',
          marginTop: '0.5rem',
          marginBottom: '0.5rem',
          borderBottom: '2px solid #a277e4', // assuming tailwind's purple-70
          paddingRight: '1rem',
        }}
      >
        <div style={{ gridColumn: 'span 2', fontWeight: 600 }}>Candidate</div>
        <div style={{ gridColumn: 'span 1', fontWeight: 600, textAlign: 'right' }}>Score</div>
      </div>

      <div
        style={{
          overflowY: 'auto',
          paddingRight: '1rem',
          borderTop: '2px solid transparent', // used for divide-y spacing
        }}
      >
        {results.map((result) => (
          <div
            key={result.nominationID}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              marginTop: '0.25rem',
              marginBottom: '0.25rem',
              alignItems: 'center',
              borderTop: '2px solid #e5e7eb', // tailwind's default divide color (gray-200)
            }}
          >
            <div style={{ gridColumn: 'span 2' }}>{result.nominationText}</div>
            <div style={{ gridColumn: 'span 1', textAlign: 'right' }}>
              {result.score.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      </div>
    </>
  );
};

export default ResultCard;
