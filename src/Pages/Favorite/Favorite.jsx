import React, {useEffect, useState} from 'react';
import {Avatar, Button, ButtonGroup, IconButton, Skeleton} from "@mui/material";
import {FAVORITE_ROUTE, HOME_ROUTE, NEWS_ROUTE} from "../../utils/Consts";
import {useNavigate} from "react-router-dom";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import {Add} from "@mui/icons-material";
import {useSelector} from "react-redux";

import './Favorite.css'
import {IOSSlider} from "../../Assets/Sliders";
import MyButton from "../../components/MyButton";

const Favorite = () => {
    const navigate = useNavigate();

    const projects   = useSelector(state => state.projects)
    const user      = useSelector(state => state.user)

    const [userFavorite, setUserFavorite] = useState(null);

    useEffect(() => {
        const result = [];

        projects.forEach(el => {

            user.favorite.map(item => {
                if (item === el.id) {
                    result.push(el)
                }
                return false
            })
        })

        setUserFavorite(result);
    }, [user, projects]);

    return (
        <div className={"container"}>
            <h5>
                <IconButton onClick={() => navigate(HOME_ROUTE)} aria-label="add">
                    <KeyboardBackspaceIcon/>
                </IconButton>
                Favorite page... Coming soon
            </h5>
            {userFavorite
                ?
                    <>
                        {userFavorite.length
                            ?
                                <>
                                    {userFavorite.map((el, index) => {

                                        return (
                                            <div className={"Favorite_item"} key={index}>
                                                <div className={"Favorite_item_info_wrapper"}>
                                                    <div className={"Favorite_item_info"}>
                                                        <div style={{display: "flex", gap: 8, alignItems: "center"}}>
                                                            <Avatar variant={"rounded"} sx={{width: 64, height: "100%"}} src={el.imgPath}>N</Avatar>
                                                            <div>
                                                                <h6>{el.name}</h6>
                                                                <article>Last launch: 12-07-2024</article>
                                                            </div>
                                                        </div>
                                                        <MyButton>Launch</MyButton>
                                                    </div>
                                                    <IOSSlider value={35}/>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </>
                            : <MyButton>У вас нету ни одного любимого проекта </MyButton>
                        }
                    </>
                :
                    <Skeleton variant="rectangular" width={"100%"} height={350}/>

            }
        </div>
    );
};

export default Favorite;