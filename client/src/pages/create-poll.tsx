import { useState } from "react";
import { Button } from "../components/Button";
import { Counter } from "../components/Counter";
import { TextField } from "../components/Input";
import { useNavigate } from '../../../node_modules/react-router-dom/dist/index';

export function CreatePollPage() {
    const [pollTopic, setPollTopic] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const areFieldsValid = (): boolean => {
        if(name.length < 1 || pollTopic.length < 1)
            return false;
        return true;
    }
    const handleClickCreatePoll = () => {
        if(areFieldsValid()) {
            navigate('/poll');
        }
        else {
            // show err message
        }
    }
    const handleClickStartOver = () => {
        if(areFieldsValid()) {
            navigate('/vote');
        }
        else {
            // show err message
        }
    }
    const handleOnChangeTopic = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPollTopic(e.target.value);
    }
    const handleOnChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    }

    return (
        <>
            <h2>Enter Poll Topic</h2>
            <TextField maxLength={100} placeholder="" onChange={handleOnChangeTopic}/>
            <h2>Enter Your Name</h2>
            <TextField maxLength={25} placeholder="" onChange={handleOnChangeName}/>
            <h2>Votes Per Participant</h2>
            <Counter />
            <Button title="Create" onClickHandler={handleClickCreatePoll}/>
            <Button title="Start Over" onClickHandler={handleClickStartOver}/>
        </> 
    );
}