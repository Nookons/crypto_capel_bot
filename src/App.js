import React, {useEffect} from 'react';
import Main from "./Display/Main";
import Header from "./Header/Header";

import './App.css'
import {useTelegram} from "./Hooks/useTelegram";
import {Route, Routes} from "react-router-dom";
import Posts from "./Posts/Posts";

import {doc, getDoc, setDoc} from "firebase/firestore";
import {db} from "./firebase";

const App = () => {
    const {tg, user} = useTelegram();

    useEffect(() => {
        tg.ready();
        tg.expand();
    }, []);

    useEffect(() => {
        async function setUser() {
            if (user) {
                const docRef = doc(db, "users", user.id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    console.log("User data:", docSnap.data());
                } else {
                    await setDoc(doc(db, "users", user.id), {
                        applicationId: Date.now(),
                        ...user
                    });
                }
            }
        }

        setUser();
    }, []);


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