import { Button } from "../components/button";

export function WelcomePage() {
    const handleClickCreatePoll = () => {
        console.log('Create new poll!');
    };
    const handleClickJoinPoll = () => {
        console.log('Join existing poll!');
    };


    return (
        <>
            <h1>Click2Vote</h1><h1> A Lightweight, Real-Time Voting</h1><h1>Platform for 
                Creating Polls
            </h1>
            <Button title="Create New Poll" onClickHandler={handleClickCreatePoll}/>
            <br /> <br />
            <Button title="Join Existing Poll" onClickHandler={handleClickJoinPoll}/>
        </>
    );
}