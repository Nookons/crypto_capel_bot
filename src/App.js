import React from 'react';
import Main from "./Display/Main";
import Header from "./Header/Header";

import './App.css'
import {useTelegram} from "./Hooks/useTelegram";

const App = () => {
    const { tg, user } = useTelegram();

    console.log(user);

    return (
        <div className={"container"}>
            <Header />
            <h5 style={{
                textAlign: "center",
                padding: 14
            }}>test</h5>
            <Main />
        </div>
    );
};

export default App;