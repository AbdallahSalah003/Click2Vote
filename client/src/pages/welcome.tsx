import React from 'react';
import { actions, AppPage } from '../state';

const Welcome: React.FC = () => {
  return (
    <div >
      <h1 style={{"margin": "50px", "textAlign":"center", "fontWeight": "bold", "fontSize": "60px"}}>Welcome to Click2Vote</h1>
      <div style={{"textAlign": "center"}}>
        <button style={{"margin": "20px"}}
          className="box btn-orange my-2"
          onClick={() => actions.setPage(AppPage.Create)}
        >
          Create New Poll
        </button>
        <button
          className="box btn-purple my-2"
          onClick={() => actions.setPage(AppPage.Join)}
        >
          Join Existing Poll
        </button>
      </div>
    </div>
  );
};

export default Welcome;