import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";

export function WelcomePage() {
    const navigate = useNavigate();

    const handleClickCreatePoll = () => {
        navigate('/create');
    };
    const handleClickJoinPoll = () => {
        navigate('/join');
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