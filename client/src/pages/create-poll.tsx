import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { Counter } from "../components/Counter";
import { TextField } from "../components/Input";
import { useNavigate } from '../../../node_modules/react-router-dom/dist/index';
import { makeRequest } from "../api";
import { Poll } from 'shared';
import { jwtDecode } from 'jwt-decode';
import Cookies from "js-cookie";

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
            const { data, error } = await makeRequest<{
                poll: Poll;
                accessToken: string;
            }>('/polls', {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({
                    topic: pollTopic,
                    votesPerVoter: maxVotes,
                    name,
                }),
            });

            console.log(data, error);

            if (error && error.statusCode === 400) {
                console.log('400 error', error);
                setErrorMessage('Name and poll topic are both required!');
            } else if (error && error.statusCode !== 400) {
                setErrorMessage(error.messages[0]);
            } else {
                const jwt_hp = Cookies.get('jwt_hp');
                console.log(jwt_hp);
                if (jwt_hp) {
                    const userInfo = jwtDecode(jwt_hp); 
                    console.log(userInfo);
                }

                navigate('/waiting-room');
            }
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