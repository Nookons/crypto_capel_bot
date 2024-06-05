import React, {useEffect} from 'react';
import './App.css'
import './App.css'
import Header from "./Header/Header";
import Main from "./Display/Main";

import copyIcon from './Assets/copy.svg'

//const tg = window.Telegram.WebApp;

const App = () => {

   /* useEffect(() => {
        tg.ready();
    }, []);

    const onClose = () => {
        tg.close();
    }*/

    return (
        <div className={"container"}>
            <Header />
            <div style={{
                display: "flex",
                justifyContent: "center",
                gap: 4,
                alignItems: "center",
                textAlign: "center",
                padding: 14
            }}>
                <h5>nookon.tg</h5>
                <button style={{
                    border: "none",
                    background: "none"
                }}>
                    <img style={{maxWidth: 20}} src={copyIcon} alt=""/>
                </button>
            </div>
            <Main />
        </div>
    );
};

export default App;