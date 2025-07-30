import { useEffect, useState } from "react";
import { Button } from "../components/Button";
import { TextField } from "../components/Input";
import { useNavigate } from "react-router-dom";
import { makeRequest } from "../api";
import { Poll } from "shared";
import { set } from "js-cookie";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export function JoinPollPage() {
    const [errorMessage, setErrorMessage] = useState('');
    const [name, setName] = useState('');
    const [pollCode, setPollCode] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if(name.trim() && pollCode.trim()) {
            setErrorMessage('');
        }
    }, [name, pollCode])

    const isValidFields = (): boolean => {
        return pollCode.trim().length>0 && name.trim().length>0;
    }
    const handleOnChangeCode = (e: React.ChangeEvent<HTMLInputElement>) =>  {
        setPollCode(e.target.value);
    }
    const handleOnChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    }
    const handleClickJoinPoll = async () => {
        if(isValidFields()) {
            setErrorMessage('');

            const {data, error} = await makeRequest<{
                poll: Poll;
                accessToken: string;
            }>('/polls/join', {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({
                    pollID: pollCode.toUpperCase(),
                    name
                })
            });
            console.log(data, error);
            if(error && error.statusCode == 500) {
                setErrorMessage('Poll does not exist, please enter a valid poll code')
            }
            else {
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
            setErrorMessage('Poll Code and Name must be provided to join a poll')
        }
    }
    const handleClickStartOver = () => {

    }
    return (
        <>
            <h2>Enter Poll Code</h2>
            <TextField maxLength={100} placeholder="" onChange={handleOnChangeCode}/>
            <h2>Enter Your Name</h2>
            <TextField maxLength={25} placeholder="" onChange={handleOnChangeName}/>
            {errorMessage && (
                <p style={{ color: 'red', fontWeight: 'bold', marginBottom: '1rem' }}>
                    {errorMessage}
                </p>
            )}
            <br/><br/>
            <Button title="Join" onClickHandler={handleClickJoinPoll}/>
            <Button title="Start Over" onClickHandler={handleClickStartOver}/>
        </>
    );
}