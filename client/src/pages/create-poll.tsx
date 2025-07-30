import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { Counter } from "../components/Counter";
import { TextField } from "../components/Input";
import { useNavigate } from '../../../node_modules/react-router-dom/dist/index';

export function CreatePollPage() {
    const [errorMessage, setErrorMessage] = useState('');
    const [pollTopic, setPollTopic] = useState('');
    const [maxVotes, setMaxVotes] = useState(1);
    const [name, setName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (name.trim() && pollTopic.trim()) {
            setErrorMessage('');
        }
    }, [name, pollTopic]);  

    const areFieldsValid = (): boolean => {
        return name.trim().length > 0 && pollTopic.trim().length > 0;
    }
    const handleClickCreatePoll = async () => {
        if(areFieldsValid()) {
            setErrorMessage('');
            navigate('/waiting-room');
        }
        else {
             setErrorMessage('Please fill in both the poll topic and your name.');
        }
    }
    const handleClickStartOver = () => {
        if(areFieldsValid()) {
            setErrorMessage('');
            navigate('/vote');
        }
        else {
             setErrorMessage('Please fill in both the poll topic and your name.');
        }
    }
    const handleOnChangeTopic = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPollTopic(e.target.value);
    }
    const handleOnChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    }
    const handleOnClickPlusCounter = () => {
        setMaxVotes(maxVotes+1);
    }
    const handleOnClickMinusCounter = () => {
        setMaxVotes(maxVotes>1?maxVotes-1:maxVotes);
    }
    return (
        <>
            <h2>Enter Poll Topic</h2>
            <TextField maxLength={100} placeholder="" onChange={handleOnChangeTopic}/>
            <h2>Enter Your Name</h2>
            <TextField maxLength={25} placeholder="" onChange={handleOnChangeName}/>
            <h2>Votes Per Participant</h2>
            <Counter count={maxVotes} onClickPlus={handleOnClickPlusCounter} onClickMinus={handleOnClickMinusCounter}/>
            {errorMessage && (
                <p style={{ color: 'red', fontWeight: 'bold', marginBottom: '1rem' }}>
                    {errorMessage}
                </p>
            )}  
            <Button title="Create" onClickHandler={handleClickCreatePoll}/>
            <Button title="Start Over" onClickHandler={handleClickStartOver}/>
        </> 
    );
}