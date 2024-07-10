import React, {useEffect} from 'react';
import {doc, getDoc, updateDoc, setDoc} from 'firebase/firestore';

import Header from "./Header/Header";
import {useTelegram} from "./Hooks/useTelegram";
import {db} from "./firebase";

import './App.css';
import dayjs from "dayjs";
import {useDispatch} from "react-redux";
import {fetchUser} from "./store/reducers/asyncActions/user/getUser";
import {fetchProjects} from "./store/reducers/asyncActions/user/getProjects";
import AppRouter from "./components/AppRoute";
import {BrowserRouter} from "react-router-dom";

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
            favorite: [1719600437313, 1720138163163, 1719600785181, 1720380641358, 1717616509003],
            last_name: "Kolomiiets",
            username: "Nookon",
            capelCoin: 0.0150
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
                const userDocId = `user_${user.id}`;

                try {
                    const userDocRef = doc(db, "users", userDocId);
                    const docSnap = await getDoc(userDocRef);

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
                    }
                } catch (error) {
                    console.error("Error updating/setting user document:", error);
                }
            }
        }

        setUser();
    }, [user]);

    return (
        <>
            <Header />
            <AppRouter />
        </>
    );
};

export default App;
