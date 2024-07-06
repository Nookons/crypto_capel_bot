import React, {useEffect, useState} from 'react';
import './Main.css'
import {collection, query, where, onSnapshot,} from "firebase/firestore";
import {db} from "../firebase";
import MyDialog from "./Dialog/MyDialog";
import {Box, Button, ButtonGroup, Slider} from "@mui/material";
import {IOSSlider} from "../Assets/Sliders";
import {useNavigate} from "react-router-dom";
import {FAVORITE_ROUTE, NEWS_ROUTE} from "../utils/Routes";
import {useSelector} from "react-redux";


const Main = () => {
    const navigate = useNavigate();
    const projects = useSelector(state => state.projects)


    const [dialog, setDialog] = useState({
        isOpen: false,
        id: 0,
        name: ""
    });


    if (!projects.length) {
        return (
            <div className={"snackbar"}>

            </div>
        )
    }

    return (
        <div>
            <MyDialog dialog={dialog} setDialog={setDialog}/>
            <ButtonGroup sx={{mb: 1}} size="small" variant="outlined" aria-label="Basic button group">
                <Button onClick={() => navigate(FAVORITE_ROUTE)}>Favorite</Button>
                <Button onClick={() => navigate(NEWS_ROUTE)}>New</Button>
            </ButtonGroup>
            <div className={"Display"}>
                {projects.map((el, index) => {

                    return (
                        <div
                            style={{
                                background: `url(${el.imgPath})`
                            }}
                            onClick={() => setDialog({isOpen: true, id: el.id, name: el.name})}
                            key={index}
                        >
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default Main;
