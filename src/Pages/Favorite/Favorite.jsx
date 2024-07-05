import React from 'react';
import {Button, ButtonGroup, IconButton} from "@mui/material";
import {FAVORITE_ROUTE, HOME_ROUTE, NEWS_ROUTE} from "../../utils/Routes";
import {useNavigate} from "react-router-dom";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import {Add} from "@mui/icons-material";

const Favorite = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h5>
                <IconButton onClick={() => navigate(HOME_ROUTE)} aria-label="add">
                    <KeyboardBackspaceIcon/>
                </IconButton>
                Favorite page... Coming soon
            </h5>
        </div>
    );
};

export default Favorite;