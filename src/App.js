import React, {useEffect} from 'react';
import Main from "./Display/Main";
import Header from "./Header/Header";

import './App.css'
import {useTelegram} from "./Hooks/useTelegram";

const App = () => {
    const {tg, user} = useTelegram();

    useEffect(() => {
        tg.ready();
        tg.expand();
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
            <Main/>
        </div>
    );
};

export default App;