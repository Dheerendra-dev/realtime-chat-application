import { Button, TextField, Box } from '@mui/material';

import { useState } from 'react';

const Login = ({ signInWithEmail, signInWithGoogle }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <Box>
            <TextField
                label="Email"
                variant="standard"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                label="Password"
                variant="standard"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={() => signInWithEmail(email, password)}
                sx={{ mt: 2 }}
            >
                Sign in with Email
            </Button>
            <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={() => signInWithGoogle(email, password)}
                sx={{ mt: 2 }}
            >
                Sign in with Google
            </Button>
        </Box>
    )
}

export default Login
