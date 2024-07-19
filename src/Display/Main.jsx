import React, {useEffect, useState} from 'react';
import './Main.css'
import {collection, query, where, onSnapshot,} from "firebase/firestore";
import {db} from "../firebase";
import MyDialog from "./Dialog/MyDialog";
import {Box, Button, ButtonGroup, Skeleton, Slider} from "@mui/material";
import {IOSSlider} from "../Assets/Sliders";
import {useNavigate} from "react-router-dom";
import {FAVORITE_ROUTE, NEWS_ROUTE} from "../utils/Consts";
import {useSelector} from "react-redux";
import MyButton from "../components/MyButton";


import BallotIcon from '@mui/icons-material/Ballot';
import ClaimWindow from "./ClaimWindow/ClaimWindow";


const Main = () => {
    const navigate = useNavigate();
    const projects = useSelector(state => state.projects)

    const [sorted, setSorted] = useState(null);

    const [claimWindow, setClaimWindow] = useState({
        isOpen: false,
        currentItem: {}
    });

    useEffect(() => {
        if(projects.length) {
            const sorted = projects.sort((a, b) => b.likes - a.likes);
            setSorted(sorted)
        }
    }, [projects]);


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
        <div className={"container"}>
            <ClaimWindow open={claimWindow} setOpen={setClaimWindow} />
            <MyDialog dialog={dialog} setDialog={setDialog} setClaimWindow={setClaimWindow}/>
            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                 gap: 8
            }}>
                <MyButton click={() => navigate(NEWS_ROUTE)}><BallotIcon/> All projects</MyButton>
                <MyButton click={() => navigate(FAVORITE_ROUTE)}><BallotIcon/> Favorite</MyButton>
            </div>
            {sorted
                ?
                <div className={"Display"}>
                    {sorted.map((el, index) => {

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
            : <Skeleton sx={{mt: "8px"}} variant="rectangular" width={"100%"} height={250} />
            }
        </div>
    );
};

export default Main;
