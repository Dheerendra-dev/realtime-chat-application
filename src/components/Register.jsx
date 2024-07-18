import { Button, TextField, Box } from '@mui/material';
import { useState } from 'react';

const Register = ({ signUpWithEmail }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    return (
        <Box>
            <TextField
                label="Email"
                variant="outlined"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
                label="Password"
                variant="outlined"
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
                onClick={signUpWithEmail}
                sx={{ mt: 2 }}
            >
                Sign up with Email
            </Button>
        </Box>
    )
}

export default Register
