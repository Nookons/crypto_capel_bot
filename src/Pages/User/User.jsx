import React, {useEffect, useState} from 'react';
import {useSelector} from "react-redux";
import {Add} from "@mui/icons-material";
import {Avatar, IconButton, Skeleton} from "@mui/material";
import './User.css'

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import GradeIcon from '@mui/icons-material/Grade';

import AccountTreeIcon from '@mui/icons-material/AccountTree';
import LanguageIcon from '@mui/icons-material/Language';
import InsertLinkIcon from '@mui/icons-material/InsertLink';

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
                <Avatar variant={"rounded"}>{user.username.slice(0, 1)}</Avatar>
                <div className={"Block_info"}>
                    <h6>{user.username}.tg </h6>
                    <p>{user.capelCoin} $</p>
                </div>
                <IconButton aria-label="add">
                    <ArrowForwardIcon/>
                </IconButton>
            </div>
            <div className={"Button_wrapper"}>
                <div className={"Block_button"}>
                    <Avatar sx={{width: "24px", height: "24px"}} variant={"rounded"}><AccountTreeIcon/></Avatar>
                    <div className={"Block_info"}>
                        <article>My networks</article>
                    </div>
                    <IconButton aria-label="add">
                        <ArrowForwardIcon/>
                    </IconButton>
                </div>
                <div className={"Block_button"}>
                    <Avatar sx={{width: "24px", height: "24px"}} variant={"rounded"}><InsertLinkIcon/></Avatar>
                    <div className={"Block_info"}>
                        <article>Recovery inviter </article>
                    </div>
                    <IconButton aria-label="add">
                        <ArrowForwardIcon/>
                    </IconButton>
                </div>
                <div className={"Block_button"}>
                    <Avatar sx={{width: "24px", height: "24px"}} variant={"rounded"}><LanguageIcon/></Avatar>
                    <div className={"Block_info"}>
                        <article>Language</article>
                    </div>
                    <IconButton aria-label="add">
                        <ArrowForwardIcon/>
                    </IconButton>
                </div>
            </div>
            {userFavorite
                ?
                <div className={"Block_favorite"}>
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