import React from 'react';
import Main from "./Display/Main";
import Header from "./Header/Header";

import './App.css'
import {useTelegram} from "./Hooks/useTelegram";

const App = () => {
    const {user} = useTelegram();

    return (
        <div className={"container"}>
            <Header />
            <h5>{user}</h5>
            <Main />
        </div>
    );
};

export default App;