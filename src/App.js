import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

import Main from "./Display/Main";
import Header from "./Header/Header";
import Posts from "./Posts/Posts";
import { useTelegram } from "./Hooks/useTelegram";
import { db } from "./firebase";

import './App.css';

const App = () => {
    const { tg, user } = useTelegram();

    useEffect(() => {
        tg.ready();
        tg.expand();
    }, [tg]);

    useEffect(() => {
        async function setUser() {
            if (user) {
                console.log('User object:', user);
                const userDocId = `user_${user.id}`;
                console.log('User document ID:', userDocId);

                try {
                    const userDocRef = doc(db, "users", userDocId);
                    console.log('User document reference:', userDocRef);

                    const docSnap = await getDoc(userDocRef);
                    console.log('Document snapshot:', docSnap);

                    if (docSnap.exists()) {
                        await updateDoc(userDocRef, {
                            lastSignIn: Date.now(),
                        });
                        console.log('User document updated');
                    } else {
                        await setDoc(userDocRef, {
                            applicationId: Date.now(),
                            ...user
                        });
                        console.log('New user document set');
                    }
                } catch (error) {
                    console.error("Error updating/setting user document:", error);
                }
            }
        }

        setUser();
    }, [user]);

    return (
        <div className="container">
            <Header />
            {user && (
                <h5 style={{ textAlign: "center", padding: 14 }}>
                    Hello {user.first_name} {user.last_name} - {user.username}
                </h5>
            )}
            <Routes>
                <Route index element={<Main />} />
                <Route path="posts" element={<Posts />} />
            </Routes>
        </div>
    );
};

export default App;
