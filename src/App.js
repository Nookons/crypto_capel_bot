import React, { useEffect, useState } from 'react';
import './App.css';
import Header from "./Header/Header";
import Main from "./Display/Main";
import copyIcon from './Assets/copy.svg';

const App = () => {

    return (
        <div className="container">
            <Header />
            <div className="centered-content">
                <h5>test</h5>
                <button
                    style={{ border: "none", background: "none" }}
                    aria-label="Copy"
                >
                    <img style={{ maxWidth: 20 }} src={copyIcon} alt="Copy Icon" />
                </button>
            </div>
            <Main />
            <button
                className="close-button"
                aria-label="Close App"
            >
                Close
            </button>
        </div>
    );
};

export default App;
