import React, {useEffect} from 'react';
import Main from "./Display/Main";
import Header from "./Header/Header";

import './App.css'
import {useTelegram} from "./Hooks/useTelegram";

const App = () => {
    const {tg, userName} = useTelegram();

    useEffect(() => {
        tg.ready();
        tg.expand();
    }, []);

    return (
        <div className={"container"}>
            <Header/>
            {userName ?
                <h5 style={{
                    textAlign: "center",
                    padding: 14
                }}>
                    {userName}.tg
                </h5>
                : null
            }
            <Main/>
        </div>
    );
};

export default App;