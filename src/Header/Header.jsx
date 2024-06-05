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
                <article>Crypto Capel</article>
            </div>
            <div className={"User_block"}>
                <img src={userLogo} alt="logotype"/>
                <img src={userSettings} alt="logotype"/>
            </div>
        </div>
    );
};

export default Header;