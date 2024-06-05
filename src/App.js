import React, {useEffect} from 'react';
import Main from "./Display/Main";
import Header from "./Header/Header";

import './App.css'
import {useTelegram} from "./Hooks/useTelegram";
import {Route, Routes} from "react-router-dom";
import Posts from "./Posts/Posts";

import {doc, getDoc, updateDoc, setDoc} from "firebase/firestore";
import {db} from "./firebase";

const App = () => {
    const {tg, user} = useTelegram();

    useEffect(() => {
        tg.ready();
        tg.expand();
    }, []);

    useEffect(() => {
        async function setUser() {
            try {
                if (user) {
                    console.log(user)
                    console.log("user_" + user.id)

                    const docRef = doc(db, "users", user.id);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        await updateDoc(doc(db, "users", "user_" + user.id), {
                            lastSignIn: Date.now(),
                        });
                    } else {
                        await setDoc(doc(db, "users", "user_" + user.id), {
                            applicationId: Date.now(),
                            ...user
                        });
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }

        setUser();
    }, [user, tg]);


    return (
        <div className={"container"}>
            <Header/>
            {user ?
                <h5 style={{
                    textAlign: "center",
                    padding: 14
                }}>
                    Hello {user.first_name} {user.last_name} - {user.username}.tg
                </h5>
                : null
            }
            <Routes>
                <Route index element={<Main/>}/>
                <Route path={'posts'} element={<Posts/>}/>
            </Routes>
        </div>
    );
};

export default App;