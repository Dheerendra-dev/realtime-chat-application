import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Login from './Login';
import Register from './Register';
import { auth, db, provider } from "../Db/firebaseConfig";

import { nanoid } from 'nanoid'
import Cookies from 'universal-cookie';

import { Typography, Container, Box, Tabs, Tab } from '@mui/material';
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const AuthProvider = ({ setUserData }) => {
    const id = nanoid()
    const navigate = useNavigate()
    const cookies = new Cookies();
    const [tab, setTab] = useState(0);
    const signInWithGoogle = async () => {
        try {
            const { user } = await signInWithPopup(auth, provider);
            await addDoc(collection(db, "linkIds"), {
                user: user.uid,
                linkId: id,
                createdAt: serverTimestamp(),
            });
            cookies.set("auth-token", user.refreshToken);
            cookies.set("link-id", id);
            localStorage.setItem('userId', user.uid);
            setUserData(user)
            navigate("/chat")
        } catch (err) {
            console.error(err);
        }
    };

    const signInWithEmail = async (email, password) => {
        try {
            const { user } = await signInWithEmailAndPassword(auth, email, password);
            await addDoc(collection(db, "linkIds"), {
                user: user.uid,
                linkId: id,
                createdAt: serverTimestamp(),
            });
            cookies.set("auth-token", user.refreshToken);
            cookies.set("link-id", id);
            setUserData(user)
            navigate("/chat")
        } catch (error) {
            console.error("Error signing in with email", error);
        }
    };

    const signUpWithEmail = async (email, password) => {
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log(response);
        } catch (error) {
            console.error("Error signing up with email", error);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" align="center">Welcome</Typography>
                <Tabs value={tab} onChange={handleTabChange} centered>
                    <Tab label="Login" />
                    <Tab label="Register" />
                </Tabs>
                {tab === 0 && (
                    <Login signInWithGoogle={signInWithGoogle} signInWithEmail={signInWithEmail} />
                )}
                {tab === 1 && (
                    <Register signUpWithEmail={signUpWithEmail} />
                )}
            </Box>
        </Container>
    );
};

export default AuthProvider;
