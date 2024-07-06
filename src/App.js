import React, {useEffect} from 'react';
import {Route, Routes} from 'react-router-dom';
import {doc, getDoc, updateDoc, setDoc} from 'firebase/firestore';

import Main from "./Display/Main";
import Header from "./Header/Header";
import {useTelegram} from "./Hooks/useTelegram";
import {db} from "./firebase";

import './App.css';
import dayjs from "dayjs";
import Footer from "./Footer/Footer";
import Favorite from "./Pages/Favorite/Favorite";
import News from "./Pages/News/News";
import {useDispatch} from "react-redux";
import {fetchUser} from "./store/reducers/asyncActions/user/getUser";
import {fetchProjects} from "./store/reducers/asyncActions/getProjects";

const App = () => {
    const dispatch = useDispatch();
    const {tg, user} = useTelegram();

    useEffect(() => {
        tg.ready();
        tg.expand();

        const notTelegramUserTemp = {
            allows_write_to_pm: true,
            first_name: "Dmytro",
            id: 662123629,
            language_code: "en",
            last_name: "Kolomiiets",
            username: "Nookon"
        }

        const id = user ? user.id : notTelegramUserTemp.id

        if (user) {
            dispatch({type: "USER_ENTER", payload: user})
        } else {
            dispatch({type: "USER_ENTER", payload: notTelegramUserTemp})
        }

        dispatch(fetchUser(id))
        dispatch(fetchProjects())
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
                            lastSignIn: dayjs().format("dddd, MMMM DD, YYYY [at] HH:mm"),
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
        <div>
            <Header/>
            <div className="container">
                {/*{user ? (
                <h5 style={{textAlign: "center", padding: 14}}>
                    Hello {user.first_name} {user.last_name} - {user.username}
                </h5>
            ) : (<h5 style={{textAlign: "center", padding: 14}}>
                nookon
            </h5>)
            }*/}
                <Routes>
                    <Route index element={<Main />}/>
                    <Route path="/favorite" element={<Favorite />}/>
                    <Route path="/news" element={<News />}/>
                </Routes>
                {/*<Footer />*/}
            </div>
        </div>
    );
};

export default App;
