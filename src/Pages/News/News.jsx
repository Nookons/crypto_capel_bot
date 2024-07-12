import React from 'react';
import {Button, ButtonGroup, IconButton} from "@mui/material";
import {FAVORITE_ROUTE, HOME_ROUTE} from "../../utils/Consts";
import {useNavigate} from "react-router-dom";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

const News = () => {
    const navigate = useNavigate();

    return (
        <div className={"container"}>
            <h5>
                <IconButton onClick={() => navigate(HOME_ROUTE)} aria-label="add">
                    <KeyboardBackspaceIcon/>
                </IconButton>
                All projects page... Coming soon
            </h5>
        </div>
    );
};

export default News;