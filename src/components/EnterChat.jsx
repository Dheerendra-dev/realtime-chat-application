import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatRoom from './ChatRoom';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Cookies from 'universal-cookie';
import { db } from '../Db/firebaseConfig';

const EnterChat = ({ userData }) => {
    const navigate = useNavigate();
    const cookies = new Cookies();
    const [roomID, setRoomId] = useState("");
    const [room, setRoom] = useState(cookies.get("link-id") || "");

    useEffect(() => {
        if (!userData) {
            navigate("/");
        }
    }, []);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(room);
        alert("Room ID copied to clipboard!");
    };

    const checkRoomExists = async (roomId) => {
        const roomQuery = query(collection(db, "linkIds"), where("linkId", "==", roomId));
        const roomSnapshot = await getDocs(roomQuery);
        return !roomSnapshot.empty;
    };

    const enterChatWithExistingRoom = async (roomID) => {
        const roomExists = await checkRoomExists(roomID);
        if (roomExists) {
            setRoom(roomID);
        } else {
            alert("Room does not exist or has expired.");
        }
    };

    const handleNavigation = () => {
        navigate(`/chat/${room}`);
    }

    return (
        <div className='w-full flex h-screen  items-center justify-evenly bg-gray-900'>
            <div className='justify-center flex'>
                <Paper sx={{ width: 500, p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="p">Your Room ID: {room}</Typography>
                        <Button variant="contained" color="primary" onClick={copyToClipboard}>
                            Copy
                        </Button>
                    </Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" >
                        <Typography variant="p" mb={2}>Enter existing room ID:</Typography>
                        <TextField
                            variant="outlined"
                            fullWidth
                            value={roomID}
                            onChange={(e) => setRoomId(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                    </Box>
                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        sx={{ mb: 2 }}

                        onClick={() => enterChatWithExistingRoom(roomID)}
                    >
                        Enter Chat
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        fullWidth
                        onClick={() => handleNavigation()}
                    >
                        Enter Chat with your Id
                    </Button>
                </Paper >
            </div >

        </div >
    );
};

export default EnterChat;
