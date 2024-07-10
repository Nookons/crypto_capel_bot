import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {Add} from "@mui/icons-material";
import {Avatar, IconButton, Skeleton} from "@mui/material";
import './User.css'

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import GradeIcon from '@mui/icons-material/Grade';

const User = () => {
    const user = useSelector((state) => state.user);
    const projects = useSelector(state => state.projects)

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
            <div className={"Block"}>
                <Avatar variant={"rounded"}>N</Avatar>
                <div className={"Block_info"}>
                    <h6>{user.username}.tg </h6>
                    <p>{user.capelCoin} $</p>
                </div>
                <IconButton aria-label="add">
                    <ArrowForwardIcon/>
                </IconButton>
            </div>
            {userFavorite
                ?
                <div className={"Block_favorite"}>
                    <div style={{width: "100%", display: "flex", alignItems: "center", gap: 8}}>
                        <GradeIcon/>
                        <article> Favorite projects</article>
                    </div>
                    <div className={"Block_favorite_projects"}>
                        {userFavorite.map((el, index) => {


                            return (
                                <Avatar variant={"rounded"} sx={{width: "100%", height: 55}} src={el.imgPath}>N</Avatar>
                            )
                        })}
                    </div>
                </div>
            :
                <Skeleton sx={{mt: "14px"}} variant="rectangular" width={"100%"} height={260} />
            }
        </div>
    );
};

export default User;