import React from 'react';
import './Header.css'

import logo from '../Assets/logo.png'

import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {Add} from "@mui/icons-material";
import {IconButton} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {HOME_ROUTE, USER_ROUTE} from "../utils/Consts";

const Header = () => {
    const navigate = useNavigate();

    return (
        <div className={"Main"}>
            <div onClick={() => navigate(HOME_ROUTE)} className={"Logo"}>
                <img src={logo} alt="logotype"/>
                <h4>Crypto Capel</h4>
            </div>
            <div className={"User_block"}>
                <IconButton onClick={() => navigate(USER_ROUTE)} aria-label="add">
                    <AccountCircleIcon/>
                </IconButton>
            </div>
        </div>
    );
};

export default Header;