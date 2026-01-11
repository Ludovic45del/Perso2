import React from 'react';
import {loginServices} from '../../services/account/login.services';
import {useNavigate} from 'react-router-dom';
import {Paper, TextField} from '@mui/material';
import './login.css';
import Button from '@mui/material/Button';

const LoginPage = () => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const nav = useNavigate();

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        event.stopPropagation();
        loginServices(username, password)
            .then(data => data.json())
            .then(data => {
                localStorage.setItem('token', JSON.stringify(data));
                nav('/dashboard');
            })
            .catch((error) => {
                console.log(error);
            });

    };

    return (
        <div className="login-container">
            <Paper className="login-paper">
                <form className="login-form" onSubmit={handleSubmit}>
                    <img height={150} width={150} src={'/CEALogo.png'} alt='CEA Logo'/>

                    <TextField label="Username" value={username} onChange={e => setUsername(e.target.value)} type="text"/>
                    <TextField label="Password" value={password} onChange={e => setPassword(e.target.value)} type="password"/>
                    <Button variant="contained" type="submit" >
                        Connexion
                    </Button>
                </form>
            </Paper>
        </div>
    );
};
export default LoginPage;
