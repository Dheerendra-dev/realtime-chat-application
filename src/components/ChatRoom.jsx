import React, { useState, useEffect } from "react";
import { db, auth } from "../Db/firebaseConfig";
import {
    collection,
    addDoc,
    getDocs,
    doc,
    where,
    onSnapshot,
    query,
    orderBy,
    deleteDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import Cookies from "universal-cookie";
import { useNavigate, useParams } from "react-router-dom";
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Avatar,
    Box,
    CircularProgress,
} from "@mui/material";

const cookies = new Cookies();
const ChatRoom = () => {
    const { room } = useParams()
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const messagesRef = collection(db, "messages");
    const user = auth?.currentUser;

    const getCurrentTime = () => {
        const now = new Date();
        const options = { hour: "numeric", minute: "numeric", hour12: true };
        return now.toLocaleTimeString("en-US", options);
    };

    useEffect(() => {
        const fetchMessages = async () => {
            setLoading(true);
            try {
                const queryMessages = query(
                    messagesRef,
                    where("room", "==", room),
                    orderBy("createdAt")
                );
                const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
                    const messages = [];
                    snapshot.forEach((doc) => {
                        messages.push({ ...doc.data(), id: doc.id });
                    });
                    setMessages(messages);
                    setLoading(false);
                });
                return () => unsubscribe();
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchMessages();
    }, [room]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (newMessage === "") return;
        try {
            await addDoc(messagesRef, {
                text: newMessage,
                createdAt: getCurrentTime(),
                user: user?.displayName,
                room,
                userInfo: user?.uid,
                profile: user?.photoURL,
            });
            setNewMessage("");
        } catch (error) {
            setError(error.message);
        }
    };

    const signUserOut = async () => {
        if (room) {
            const roomQuery = query(
                collection(db, "linkIds"),
                where("linkId", "==", room)
            );
            const roomSnapshot = await getDocs(roomQuery);
            roomSnapshot.forEach(async (roomDoc) => {
                await deleteDoc(roomDoc.ref);
            });

            const messagesRef = collection(db, "messages");
            const q = query(messagesRef, where("room", "==", room));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (messageDoc) => {
                await deleteDoc(messageDoc.ref);
            });
        }

        await signOut(auth);
        cookies.remove("auth-token");
        cookies.remove("link-id");
        navigate("/");
    };

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100vh"
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }
    const joinAnotherRoom = () => {
        navigate(`/chat`);
    }
    return (
        <div className="bg-gray-900 w-screen h-screen justify-center flex items-center">
            <Container maxWidth="sm">
                <Paper elevation={3} style={{ padding: "1rem", marginTop: "1rem" }}>
                    <Typography variant="p" gutterBottom>
                        Welcome to <span style={{ color: "#8E24AA" }}>{room.toUpperCase()}</span> Room
                    </Typography>
                    <Box
                        display="flex"
                        flexDirection="column"
                        height="300px"
                        overflow="auto"
                        style={{ backgroundColor: "#F5F5F5", padding: "1rem" }}
                    >
                        {messages.map((message) => {
                            const isCurrentUser = message?.userInfo === user?.uid;
                            return (
                                <Box
                                    key={message?.id}
                                    display="flex"
                                    justifyContent={isCurrentUser ? "flex-end" : "flex-start"}
                                    mb={2}
                                >
                                    {!isCurrentUser && (
                                        <Avatar
                                            src={message?.profile}
                                            alt="User profile"
                                            style={{ marginRight: "0.5rem" }}
                                        />
                                    )}
                                    <Box
                                        bgcolor={isCurrentUser ? "#8E24AA" : "#616161"}
                                        color="white"
                                        p={2}
                                        borderRadius={8}
                                        maxWidth="70%"
                                    >
                                        <Typography variant="subtitle2">
                                            {message?.user} <span style={{ fontSize: "0.8rem" }}>{message?.createdAt}</span>
                                        </Typography>
                                        <Typography variant="body2" style={{ wordBreak: "break-word" }}>
                                            {message?.text}
                                        </Typography>
                                    </Box>
                                    {isCurrentUser && (
                                        <Avatar
                                            src={message?.profile}
                                            alt="User profile"
                                            style={{ marginLeft: "0.5rem" }}
                                        />
                                    )}
                                </Box>
                            );
                        })}
                    </Box>
                    <form onSubmit={handleSubmit} style={{ display: "flex", marginTop: "1rem" }}>
                        <TextField
                            value={newMessage}
                            onChange={(event) => setNewMessage(event.target.value)}
                            variant="outlined"
                            fullWidth
                            placeholder="Type your message here..."
                        />
                        <Button type="submit" variant="contained" color="primary" style={{ marginLeft: "1rem" }}>
                            Send
                        </Button>
                    </form>
                    <Button
                        onClick={signUserOut}
                        variant="contained"
                        color="secondary"
                        fullWidth
                        style={{ marginTop: "1rem" }}
                    >
                        Sign Out
                    </Button>
                    <Button
                        onClick={joinAnotherRoom}
                        variant="contained"
                        color="secondary"
                        fullWidth
                        style={{ marginTop: "1rem" }}
                    >
                        Join Another Room
                    </Button>
                </Paper>
            </Container>
        </div>
    );
};

export default ChatRoom;
