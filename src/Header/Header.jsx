import React from 'react';
import './Header.css'

import logo from '../Assets/logo.png'

import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {Add} from "@mui/icons-material";
import {Box, IconButton} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {HOME_ROUTE, USER_ROUTE} from "../utils/Consts";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

const Header = () => {
    const isUser = window.location.href.split("/")[3]
    const navigate = useNavigate();

    return (
        <div className={"Main"}>
            {isUser === "user"
                ?
                <Box onClick={() => navigate(HOME_ROUTE)} sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "rgba(0,0,0, 0.25)",
                    px: 1,
                    borderRadius: 2
                }}>
                    <IconButton aria-label="back">
                        <KeyboardBackspaceIcon/>
                    </IconButton>
                    <p>Повернутись</p>
                </Box>
                :
                <div onClick={() => navigate(HOME_ROUTE)} className={"Logo"}>
                    <img src={logo} alt="logotype"/>
                    <h4>Crypto Capel</h4>
                </div>
            }
            <div className={"User_block"}>
                <IconButton onClick={() => navigate(USER_ROUTE)} aria-label="add">
                    <AccountCircleIcon/>
                </IconButton>
            </div>
        </div>
    );
};

export default Header;