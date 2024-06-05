import React, {useEffect} from 'react';
import './App.css'
import MyButton from "./Button/MyButton";

const tg = window.Telegram.WebApp;

const App = () => {

    useEffect(() => {
        tg.ready();
    }, []);

    const onClose = () => {
        tg.close();
    }

    return (
        <div>
          <h5>App...</h5>
            <MyButton onClick={onClose} >Close</MyButton>
        </div>
    );
};

export default App;