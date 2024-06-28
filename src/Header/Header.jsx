import React from 'react';
import './Header.css'

import logo from '../Assets/logo.svg'
import userLogo from '../Assets/user.svg'
import userSettings from '../Assets/settings.svg'

const Header = () => {


    return (
        <div className={"Main"}>
            <div className={"Logo"}>
                <img src={logo} alt="logotype"/>
                <h4>Crypto Capel</h4>
            </div>
            <div className={"User_block"}>
                <button  disabled><img src={userLogo} alt="logotype"/></button>
                <button  disabled><img src={userSettings} alt="logotype"/></button>
            </div>
        </div>
    );
};

export default Header;