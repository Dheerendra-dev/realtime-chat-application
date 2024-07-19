import { Button } from '@mui/material';
import React from "react";
import { db, auth } from "../Db/firebaseConfig";
import {
    collection,
    getDocs,
    where,
    query,
    deleteDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import Cookies from "universal-cookie";
import { useNavigate } from 'react-router-dom';

const Header = ({ isAuth }) => {
    const cookies = new Cookies();
    const navigate = useNavigate()
    const room = cookies.get("link-id") || localStorage.getItem("room");
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
    return (
        <nav className="bg-gray-200 shadow shadow-gray-300 w-100 px-8 md:px-auto">
            <div className="md:h-16 h-28 mx-auto md:px-4 container flex items-center justify-between flex-wrap md:flex-nowrap">
                <div className="text-indigo-500 md:order-1">
                    <h1 className='text-2xl font-bold'>Chat App</h1>
                </div>
                <div className="text-gray-500 order-3 w-full md:w-auto md:order-2">
                    <ul className="flex font-semibold justify-between">
                    </ul>
                </div>
                <div className="order-2 md:order-3">
                    {isAuth ?
                        <button
                            onClick={signUserOut}
                            className="px-4 py-2 bg-violet-600 hover:bg-indigo-600 text-gray-50 rounded-xl flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Sign Out
                        </button> :
                        <button className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-gray-50 rounded-xl flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>Login</span>
                        </button>
                    }
                </div>
            </div>
        </nav>
    );
};

export default Header;
