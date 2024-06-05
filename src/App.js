import React from 'react';
import Main from "./Display/Main";
import Header from "./Header/Header";

import './App.css'

const App = () => {
    return (
        <div className={"container"}>
            <Header />
            <Main />
        </div>
    );
};

export default App;